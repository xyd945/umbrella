import { AIConfig, AIProvider, ScanResult } from './types';

// Default configuration
const DEFAULT_CONFIG: AIConfig = {
  provider: AIProvider.GEMINI,
  apiKey: '',
  endpoint: '',
};

// Keys for chrome.storage
const KEYS = {
  CONFIG: 'umbrella_ai_config',
  SCAN_HISTORY: 'umbrella_scan_history',
};

// Storage utility
export const storageUtil = {
  // Get AI configuration
  getConfig: async (): Promise<AIConfig> => {
    try {
      const result = await chrome.storage.sync.get(KEYS.CONFIG);
      return result[KEYS.CONFIG] || DEFAULT_CONFIG;
    } catch (error) {
      console.error('Error getting config:', error);
      return DEFAULT_CONFIG;
    }
  },

  // Save AI configuration
  saveConfig: async (config: AIConfig): Promise<void> => {
    try {
      await chrome.storage.sync.set({ [KEYS.CONFIG]: config });
    } catch (error) {
      console.error('Error saving config:', error);
    }
  },

  // Get scan history
  getScanHistory: async (): Promise<ScanResult[]> => {
    try {
      const result = await chrome.storage.local.get(KEYS.SCAN_HISTORY);
      return result[KEYS.SCAN_HISTORY] || [];
    } catch (error) {
      console.error('Error getting scan history:', error);
      return [];
    }
  },

  // Save scan result
  saveScanResult: async (scanResult: ScanResult): Promise<void> => {
    try {
      const history = await storageUtil.getScanHistory();
      // Keep only the most recent 100 scan results
      const updatedHistory = [scanResult, ...history].slice(0, 100);
      await chrome.storage.local.set({ [KEYS.SCAN_HISTORY]: updatedHistory });
    } catch (error) {
      console.error('Error saving scan result:', error);
    }
  },

  // Clear scan history
  clearScanHistory: async (): Promise<void> => {
    try {
      await chrome.storage.local.remove(KEYS.SCAN_HISTORY);
    } catch (error) {
      console.error('Error clearing scan history:', error);
    }
  },
}; 