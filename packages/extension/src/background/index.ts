import { AIService } from '../utils/aiService';
import { WebsiteContent, ScanResult } from '../utils/types';
import { storageUtil } from '../utils/storage';

// Initialize AI service with default config
let aiService: AIService;

// Initialize the service when the extension loads
const initAIService = async () => {
  const config = await storageUtil.getConfig();
  aiService = new AIService(config);
  console.log('AI Service initialized with provider:', config.provider);
};

// Function to analyze website content
const analyzeWebsite = async (tabId: number) => {
  try {
    // Get website content from the content script
    const content = await new Promise<WebsiteContent>((resolve) => {
      chrome.tabs.sendMessage(tabId, { action: 'extractContent' }, (response) => {
        resolve(response);
      });
    });

    // Analyze the content
    const scanResult = await aiService.analyzeSecurity(content);

    // Save the scan result
    await storageUtil.saveScanResult(scanResult);

    // Update the extension icon badge based on security risk
    updateExtensionBadge(tabId, scanResult);

    return scanResult;
  } catch (error) {
    console.error('Error analyzing website:', error);
    throw error;
  }
};

// Update extension icon badge
const updateExtensionBadge = (tabId: number, scanResult: ScanResult) => {
  let color = '#33CC66'; // Default green for safe
  let text = 'SAFE';

  switch (scanResult.risk) {
    case 'critical':
      color = '#CC3333';
      text = 'RISK';
      break;
    case 'high':
      color = '#FF6633';
      text = 'RISK';
      break;
    case 'medium':
      color = '#FFCC00';
      text = 'WARN';
      break;
    case 'low':
      color = '#99CC33';
      text = 'LOW';
      break;
  }

  chrome.action.setBadgeBackgroundColor({ color, tabId });
  chrome.action.setBadgeText({ text, tabId });
};

// Initialize extension
initAIService();

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.startsWith('http')) {
    // Reset badge
    chrome.action.setBadgeText({ text: '', tabId });
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scanWebsite') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      try {
        if (tabs[0]?.id) {
          const scanResult = await analyzeWebsite(tabs[0].id);
          sendResponse(scanResult);
        }
      } catch (error) {
        console.error('Error in scanWebsite:', error);
        sendResponse({ error: 'Failed to scan website' });
      }
    });
    return true; // Required for async response
  } else if (message.action === 'updateConfig') {
    aiService.updateConfig(message.config);
    storageUtil.saveConfig(message.config);
    sendResponse({ success: true });
  }
}); 