import axios from 'axios';
import { AIConfig, AIProvider, ScanResult, SecurityRisk, WebsiteContent } from './types';

// Backend API URL - will need to be configured
const BACKEND_API_URL = 'http://localhost:3000/api';

export class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  // Update AI provider config
  public updateConfig(config: AIConfig): void {
    this.config = config;
  }

  // Main method to analyze website content
  public async analyzeSecurity(content: WebsiteContent): Promise<ScanResult> {
    try {
      const response = await axios.post(`${BACKEND_API_URL}/analyze`, {
        content,
        config: {
          provider: this.config.provider,
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error analyzing website:', error);
      return {
        url: content.url,
        risk: SecurityRisk.MEDIUM, // Default to medium as we couldn't determine
        timestamp: Date.now(),
        reasons: ['Failed to analyze website content'],
        confidenceScore: 0,
      };
    }
  }

  // Method to get provider-specific prompts
  private getPromptForProvider(content: WebsiteContent): string {
    const basePrompt = `Analyze this website for security threats, scams, or phishing attempts:
URL: ${content.url}
Title: ${content.title}
Content: ${content.text.substring(0, 1000)}...`;

    switch (this.config.provider) {
      case AIProvider.GEMINI:
        return `${basePrompt}\nProvide a security risk assessment with reasons.`;
      case AIProvider.DEEPSEEK:
        return `${basePrompt}\nDetect any security risks and rate the confidence level.`;
      default:
        return basePrompt;
    }
  }

  // Get the correct API endpoint based on provider
  private getApiEndpoint(): string {
    // If custom endpoint is provided, use that
    if (this.config.endpoint) {
      return this.config.endpoint;
    }

    // Default endpoints for providers
    switch (this.config.provider) {
      case AIProvider.GEMINI:
        return 'https://api.gemini.google.com/v1/generate';
      case AIProvider.DEEPSEEK:
        return 'https://api.deepseek.com/v1/chat/completions';
      default:
        throw new Error(`Unknown AI provider: ${this.config.provider}`);
    }
  }
} 