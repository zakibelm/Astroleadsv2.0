import axios from 'axios';
import * as db from '../db';
import { logger, logOperation, logError } from '../config/logger';
import { getValidAccessToken } from './linkedinOAuth';
import {
  checkLinkedInPostLimit,
  checkLinkedInPostInterval,
} from './rateLimiter';
import { publishPostPublished } from './pubsub';
import { captureError } from '../config/sentry';

/**
 * LinkedIn publisher service - PRODUCTION READY
 * Real LinkedIn UGC API integration with rate limiting and error handling
 */

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

export interface PublishResult {
  success: boolean;
  postId?: string;
  postUrl?: string;
  error?: string;
}

export interface LinkedInImageAsset {
  asset: string; // URN of the uploaded asset
  uploadUrl: string;
}

/**
 * Register image upload with LinkedIn
 */
async function registerImageUpload(
  accessToken: string,
  personUrn: string
): Promise<LinkedInImageAsset> {
  try {
    logOperation('LinkedIn', 'Registering image upload');

    const response = await axios.post(
      `${LINKEDIN_API_BASE}/assets?action=registerUpload`,
      {
        registerUploadRequest: {
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          owner: personUrn,
          serviceRelationships: [
            {
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent',
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    const asset = response.data.value.asset;
    const uploadUrl = response.data.value.uploadMechanism[
      'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
    ].uploadUrl;

    logger.info('[LinkedIn] Image upload registered', { asset });

    return { asset, uploadUrl };
  } catch (error: any) {
    logError('LinkedIn', 'Register image upload', error as Error, {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error('Failed to register image upload with LinkedIn');
  }
}

/**
 * Upload image bytes to LinkedIn
 */
async function uploadImage(
  uploadUrl: string,
  imageUrl: string,
  accessToken: string
): Promise<void> {
  try {
    logOperation('LinkedIn', 'Uploading image', { imageUrl });

    // Download image from S3/URL
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    const imageBuffer = Buffer.from(imageResponse.data);

    // Upload to LinkedIn
    await axios.put(uploadUrl, imageBuffer, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'image/png',
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    logger.info('[LinkedIn] Image uploaded successfully');
  } catch (error: any) {
    logError('LinkedIn', 'Upload image', error as Error, {
      status: error.response?.status,
    });
    throw new Error('Failed to upload image to LinkedIn');
  }
}

/**
 * Get user's LinkedIn URN
 */
async function getPersonUrn(accessToken: string): Promise<string> {
  try {
    const response = await axios.get(`${LINKEDIN_API_BASE}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const personUrn = `urn:li:person:${response.data.sub}`;
    logger.info('[LinkedIn] Retrieved person URN', { personUrn });

    return personUrn;
  } catch (error: any) {
    logError('LinkedIn', 'Get person URN', error as Error, {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error('Failed to get LinkedIn person URN');
  }
}

/**
 * Create a LinkedIn UGC post
 */
async function createLinkedInPost(
  accessToken: string,
  personUrn: string,
  text: string,
  imageAssetUrn?: string
): Promise<{ postId: string; postUrl: string }> {
  try {
    logOperation('LinkedIn', 'Creating post', {
      textLength: text.length,
      hasImage: !!imageAssetUrn,
    });

    // Build post payload
    const postPayload: any = {
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text,
          },
          shareMediaCategory: imageAssetUrn ? 'IMAGE' : 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    // Add media if image is present
    if (imageAssetUrn) {
      postPayload.specificContent['com.linkedin.ugc.ShareContent'].media = [
        {
          status: 'READY',
          media: imageAssetUrn,
        },
      ];
    }

    // Create post
    const response = await axios.post(`${LINKEDIN_API_BASE}/ugcPosts`, postPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    const postId = response.data.id;
    const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

    logger.info('[LinkedIn] Post created successfully', { postId, postUrl });

    return { postId, postUrl };
  } catch (error: any) {
    logError('LinkedIn', 'Create post', error as Error, {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error('Failed to create LinkedIn post');
  }
}

/**
 * Publish content to LinkedIn
 */
export async function publishToLinkedIn(
  contentId: number,
  userId: number
): Promise<PublishResult> {
  try {
    logOperation('LinkedIn', 'Publishing content', { contentId, userId });

    // Get content
    const content = await db.getContentById(contentId);
    if (!content) {
      return { success: false, error: 'Contenu introuvable' };
    }

    // Check if content is approved
    if (content.status !== 'approved') {
      return {
        success: false,
        error: 'Le contenu doit être approuvé avant publication',
      };
    }

    // Check rate limits
    const dailyLimit = await checkLinkedInPostLimit(userId);
    if (!dailyLimit.allowed) {
      logger.warn('[LinkedIn] Daily rate limit exceeded', { userId });
      return { success: false, error: dailyLimit.reason };
    }

    const intervalLimit = await checkLinkedInPostInterval(userId);
    if (!intervalLimit.allowed) {
      logger.warn('[LinkedIn] Post interval limit not met', { userId });
      return { success: false, error: intervalLimit.reason };
    }

    // Get valid access token (auto-refreshes if needed)
    const accessToken = await getValidAccessToken(userId);

    // Prepare post content
    const hashtags = content.hashtags ? JSON.parse(content.hashtags) : [];
    const postText = `${content.textContent}\n\n${hashtags.join(' ')}`;

    // Get person URN
    const personUrn = await getPersonUrn(accessToken);

    // Upload image if present
    let imageAssetUrn: string | undefined;
    if (content.imageUrl) {
      const { asset, uploadUrl } = await registerImageUpload(accessToken, personUrn);
      await uploadImage(uploadUrl, content.imageUrl, accessToken);
      imageAssetUrn = asset;
    }

    // Create post
    const { postId, postUrl } = await createLinkedInPost(
      accessToken,
      personUrn,
      postText,
      imageAssetUrn
    );

    // Update content record
    await db.publishContent(contentId, postId, postUrl);

    // Update campaign stats
    const campaign = await db.getCampaignById(content.campaignId);
    if (campaign) {
      await db.updateCampaignStats(content.campaignId, {
        totalPublished: (campaign.totalPublished || 0) + 1,
      });
    }

    // Create notification
    await db.createNotification({
      userId,
      type: 'post_published',
      title: 'Post publié sur LinkedIn',
      message: `Votre contenu a été publié avec succès sur LinkedIn.`,
      campaignId: content.campaignId,
      contentId,
    });

    // Publish event to Pub/Sub
    await publishPostPublished({
      contentId,
      userId,
      campaignId: content.campaignId,
      postId,
      postUrl,
      platform: 'linkedin',
    });

    logger.info('[LinkedIn] Post published successfully', {
      contentId,
      postId,
      postUrl,
    });

    return {
      success: true,
      postId,
      postUrl,
    };
  } catch (error) {
    logError('LinkedIn', 'Publish to LinkedIn', error as Error, {
      contentId,
      userId,
    });

    // Capture in Sentry
    captureError(error as Error, {
      user: { id: userId },
      tags: { service: 'linkedin', operation: 'publish' },
      extra: { contentId },
    });

    // Create error notification
    await db.createNotification({
      userId,
      type: 'system_error',
      title: 'Erreur de publication LinkedIn',
      message: `Une erreur s'est produite lors de la publication sur LinkedIn.`,
      contentId,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Auto-publish approved content
 */
export async function autoPublishIfApproved(
  contentId: number,
  userId: number
): Promise<PublishResult> {
  const content = await db.getContentById(contentId);

  if (!content) {
    return { success: false, error: 'Contenu introuvable' };
  }

  // Only auto-publish if quality score is high enough and status is approved
  if (content.status === 'approved' && content.qualityScore >= 70) {
    return await publishToLinkedIn(contentId, userId);
  }

  return { success: false, error: 'Contenu non éligible pour auto-publication' };
}

/**
 * Batch publish multiple approved contents with interval delay
 */
export async function batchPublish(
  contentIds: number[],
  userId: number
): Promise<{ results: PublishResult[] }> {
  const results: PublishResult[] = [];

  for (const contentId of contentIds) {
    const result = await publishToLinkedIn(contentId, userId);
    results.push(result);

    // Add 1 minute delay between posts to respect interval limits
    if (result.success && contentIds.indexOf(contentId) < contentIds.length - 1) {
      logger.info('[LinkedIn] Waiting 1 minute before next post');
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }
  }

  return { results };
}

export default {
  publishToLinkedIn,
  autoPublishIfApproved,
  batchPublish,
};
