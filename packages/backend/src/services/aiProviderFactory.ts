import { AIProvider, WebsiteContent, SecurityRisk } from '@umbrella/types';
import { GeminiService } from './geminiService';
import { DeepseekService } from './deepseekService';

/**
 * Interface for AI provider analysis results
 */
export interface AIAnalysisResult {
  risk: SecurityRisk | string;  // Using string as fallback, but SecurityRisk is preferred
  reasons: string[];
  confidenceScore: number;
}

/**
 * Interface for AI provider service
 */
export interface AIProviderService {
  analyzeContent(content: WebsiteContent): Promise<AIAnalysisResult>;
}

/**
 * Factory for creating AI provider services
 */
export class AIProviderFactory {
  /**
   * Get the appropriate AI provider service
   * @param provider - AI provider type
   * @returns AI provider service instance
   */
  static getProvider(provider: AIProvider): AIProviderService {
    switch (provider) {
      case AIProvider.GEMINI:
        return new GeminiService();
      case AIProvider.DEEPSEEK:
        return new DeepseekService();
      default:
        // Default to Gemini if provider not recognized
        return new GeminiService();
    }
  }
} 