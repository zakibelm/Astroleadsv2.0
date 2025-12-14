/**
 * API Keys Helper - Get settings from localStorage (configured in Settings)
 */

interface ApiSettings {
    openRouterKey: string;
    supabaseUrl: string;
    supabaseKey: string;
    testEmail: string;
    testModeEnabled: boolean;
}

const STORAGE_KEY = 'astroleads_api_keys';

export const getStoredSettings = (): ApiSettings => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        console.warn('Failed to parse stored settings');
    }

    return {
        openRouterKey: '',
        supabaseUrl: '',
        supabaseKey: '',
        testEmail: '',
        testModeEnabled: true,
    };
};

export const getOpenRouterKey = (): string => getStoredSettings().openRouterKey;
export const getSupabaseUrl = (): string => getStoredSettings().supabaseUrl;
export const getSupabaseKey = (): string => getStoredSettings().supabaseKey;
export const getTestEmail = (): string => getStoredSettings().testEmail;
export const isTestModeEnabled = (): boolean => getStoredSettings().testModeEnabled;

/**
 * Get the actual recipient email - redirects to test email if test mode is enabled
 */
export const getEffectiveRecipient = (originalEmail: string): string => {
    const settings = getStoredSettings();
    console.log('🔍 [TestMode] Current settings:', {
        testModeEnabled: settings.testModeEnabled,
        testEmail: settings.testEmail,
        hasTestEmail: !!settings.testEmail,
    });

    if (settings.testModeEnabled && settings.testEmail) {
        console.log(`✅ [TestMode] Redirecting email from ${originalEmail} → ${settings.testEmail}`);
        return settings.testEmail;
    }

    console.log(`⚠️ [TestMode] NOT redirecting - testModeEnabled: ${settings.testModeEnabled}, testEmail: "${settings.testEmail}"`);
    return originalEmail;
};
