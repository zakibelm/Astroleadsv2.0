import axios from 'axios';
import { logger } from '../config/logger';
import { encrypt, decrypt } from './encryption';
import * as db from '../db';

/**
 * LinkedIn OAuth 2.0 service - PRODUCTION READY
 * Handles complete OAuth flow, token management, and refresh
 */

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/api/auth/linkedin/callback';

// LinkedIn OAuth URLs
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

// OAuth scopes needed for posting
const LINKEDIN_SCOPES = [
  'openid',
  'profile',
  'email',
  'w_member_social', // Post, comment, and react to posts
  'r_basicprofile', // Read basic profile
].join(' ');

export interface LinkedInTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number; // seconds
  expiresAt: Date;
}

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  profilePicture?: string;
}

/**
 * Generate LinkedIn OAuth authorization URL
 */
export function getAuthorizationUrl(state?: string): string {
  if (!LINKEDIN_CLIENT_ID) {
    throw new Error('LINKEDIN_CLIENT_ID not configured');
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    scope: LINKEDIN_SCOPES,
    state: state || Math.random().toString(36).substring(7),
  });

  const url = `${LINKEDIN_AUTH_URL}?${params.toString()}`;
  logger.info('[LinkedIn OAuth] Generated authorization URL');

  return url;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<LinkedInTokens> {
  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    throw new Error('LinkedIn OAuth credentials not configured');
  }

  try {
    logger.info('[LinkedIn OAuth] Exchanging code for token');

    const response = await axios.post(
      LINKEDIN_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: LINKEDIN_REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    const expiresAt = new Date(Date.now() + expires_in * 1000);

    logger.info('[LinkedIn OAuth] Successfully obtained access token', {
      expiresIn: expires_in,
      expiresAt,
    });

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
      expiresAt,
    };
  } catch (error: any) {
    logger.error('[LinkedIn OAuth] Failed to exchange code for token:', {
      error: error.message,
      response: error.response?.data,
    });
    throw new Error('Failed to obtain LinkedIn access token');
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<LinkedInTokens> {
  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    throw new Error('LinkedIn OAuth credentials not configured');
  }

  try {
    logger.info('[LinkedIn OAuth] Refreshing access token');

    const response = await axios.post(
      LINKEDIN_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    const expiresAt = new Date(Date.now() + expires_in * 1000);

    logger.info('[LinkedIn OAuth] Successfully refreshed access token');

    return {
      accessToken: access_token,
      refreshToken: refresh_token || refreshToken, // Use new refresh token if provided, else keep old one
      expiresIn: expires_in,
      expiresAt,
    };
  } catch (error: any) {
    logger.error('[LinkedIn OAuth] Failed to refresh access token:', {
      error: error.message,
      response: error.response?.data,
    });
    throw new Error('Failed to refresh LinkedIn access token');
  }
}

/**
 * Get LinkedIn user profile
 */
export async function getUserProfile(accessToken: string): Promise<LinkedInProfile> {
  try {
    logger.info('[LinkedIn OAuth] Fetching user profile');

    // Get basic profile
    const profileResponse = await axios.get(`${LINKEDIN_API_BASE}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { sub, given_name, family_name, email, picture } = profileResponse.data;

    logger.info('[LinkedIn OAuth] Successfully fetched user profile', {
      userId: sub,
    });

    return {
      id: sub,
      firstName: given_name,
      lastName: family_name,
      email,
      profilePicture: picture,
    };
  } catch (error: any) {
    logger.error('[LinkedIn OAuth] Failed to fetch user profile:', {
      error: error.message,
      response: error.response?.data,
    });
    throw new Error('Failed to fetch LinkedIn user profile');
  }
}

/**
 * Store LinkedIn tokens for a user (encrypted)
 */
export async function storeUserTokens(userId: number, tokens: LinkedInTokens): Promise<void> {
  try {
    logger.info('[LinkedIn OAuth] Storing encrypted tokens for user', { userId });

    // Encrypt tokens before storage
    const encryptedAccessToken = encrypt(tokens.accessToken);
    const encryptedRefreshToken = tokens.refreshToken ? encrypt(tokens.refreshToken) : null;

    await db.updateUserProfile(userId, {
      linkedinAccessToken: encryptedAccessToken,
      linkedinRefreshToken: encryptedRefreshToken || undefined,
      linkedinTokenExpiry: tokens.expiresAt,
      linkedinConnected: true,
    });

    logger.info('[LinkedIn OAuth] Tokens stored successfully', { userId });
  } catch (error) {
    logger.error('[LinkedIn OAuth] Failed to store tokens:', error);
    throw new Error('Failed to store LinkedIn tokens');
  }
}

/**
 * Get user tokens (decrypted)
 */
export async function getUserTokens(userId: number): Promise<LinkedInTokens | null> {
  try {
    const user = await db.getUserById(userId);

    if (!user || !user.linkedinAccessToken || !user.linkedinConnected) {
      return null;
    }

    // Decrypt tokens
    const accessToken = decrypt(user.linkedinAccessToken);
    const refreshToken = user.linkedinRefreshToken ? decrypt(user.linkedinRefreshToken) : undefined;

    const expiresAt = user.linkedinTokenExpiry || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // Default 60 days

    return {
      accessToken,
      refreshToken,
      expiresIn: Math.floor((expiresAt.getTime() - Date.now()) / 1000),
      expiresAt,
    };
  } catch (error) {
    logger.error('[LinkedIn OAuth] Failed to get user tokens:', error);
    return null;
  }
}

/**
 * Get valid access token for user (refresh if needed)
 */
export async function getValidAccessToken(userId: number): Promise<string> {
  const tokens = await getUserTokens(userId);

  if (!tokens) {
    throw new Error('User not connected to LinkedIn');
  }

  // Check if token is expired or will expire in the next 5 minutes
  const expiresIn = (tokens.expiresAt.getTime() - Date.now()) / 1000;

  if (expiresIn < 300) {
    // Less than 5 minutes remaining
    logger.info('[LinkedIn OAuth] Token expiring soon, refreshing', {
      userId,
      expiresIn,
    });

    if (!tokens.refreshToken) {
      throw new Error('No refresh token available, user needs to re-authenticate');
    }

    // Refresh token
    const newTokens = await refreshAccessToken(tokens.refreshToken);

    // Store new tokens
    await storeUserTokens(userId, newTokens);

    return newTokens.accessToken;
  }

  return tokens.accessToken;
}

/**
 * Disconnect LinkedIn for a user
 */
export async function disconnectLinkedIn(userId: number): Promise<void> {
  try {
    logger.info('[LinkedIn OAuth] Disconnecting LinkedIn for user', { userId });

    await db.updateUserProfile(userId, {
      linkedinAccessToken: null,
      linkedinRefreshToken: null,
      linkedinTokenExpiry: null,
      linkedinConnected: false,
    });

    logger.info('[LinkedIn OAuth] LinkedIn disconnected successfully', { userId });
  } catch (error) {
    logger.error('[LinkedIn OAuth] Failed to disconnect LinkedIn:', error);
    throw new Error('Failed to disconnect LinkedIn');
  }
}

/**
 * Check if user has valid LinkedIn connection
 */
export async function isLinkedInConnected(userId: number): Promise<boolean> {
  try {
    const tokens = await getUserTokens(userId);
    return tokens !== null;
  } catch (error) {
    logger.error('[LinkedIn OAuth] Error checking LinkedIn connection:', error);
    return false;
  }
}

export default {
  getAuthorizationUrl,
  exchangeCodeForToken,
  refreshAccessToken,
  getUserProfile,
  storeUserTokens,
  getUserTokens,
  getValidAccessToken,
  disconnectLinkedIn,
  isLinkedInConnected,
};
