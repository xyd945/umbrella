import axios from 'axios';
import { WebsiteContent, SecurityRisk } from '@umbrella/types';
import { AIAnalysisResult, AIProviderService } from './aiProviderFactory';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Deepseek AI Service implementation
 */
export class DeepseekService implements AIProviderService {
  private apiKey: string;
  private endpoint: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.endpoint = process.env.DEEPSEEK_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions';
    
    if (!this.apiKey) {
      console.warn('Deepseek API key not found. API calls will fail.');
    }
  }

  /**
   * Analyze website content using Deepseek
   * @param content - Website content to analyze
   * @returns Analysis result
   */
  async analyzeContent(content: WebsiteContent): Promise<AIAnalysisResult> {
    try {
      // Create messages for Deepseek
      const messages = this.createMessages(content);
      
      // Make API request to Deepseek
      const response = await axios.post(
        this.endpoint,
        {
          model: 'deepseek-chat',
          messages,
          temperature: 0.2, // Lower temperature for more consistent responses
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      // Parse the response
      const result = this.parseResponse(response.data);
      return result;
    } catch (error) {
      console.error('Error calling Deepseek API:', error);
      
      // Return a default result on error
      return {
        risk: SecurityRisk.MEDIUM,
        reasons: ['Failed to analyze website due to API error'],
        confidenceScore: 0.5
      };
    }
  }

  /**
   * Create messages for Deepseek chat API
   * @param content - Website content
   * @returns Array of chat messages
   */
  private createMessages(content: WebsiteContent): any[] {
    return [
      { 
        role: "system", 
        content: "You are a security expert analyzing websites for threats, scams, and phishing attempts. Respond only with JSON." 
      },
      {
        role: "user",
        content: `Analyze this website for security threats, scams, or phishing attempts.
URL: ${content.url}
Title: ${content.title}
Content: ${content.text.substring(0, 2000)}...

Please provide:
1. A security risk assessment (SAFE, LOW, MEDIUM, HIGH, or CRITICAL)
2. Specific reasons for your assessment (list at least 3 points)
3. A confidence score between 0 and 1 indicating how certain you are

Format your response as JSON with the following structure:
{
  "risk": "LOW", 
  "reasons": ["Reason 1", "Reason 2", "Reason 3"],
  "confidenceScore": 0.8
}`
      }
    ];
  }

  /**
   * Parse Deepseek API response
   * @param responseData - Deepseek API response data
   * @returns Structured analysis result
   */
  private parseResponse(responseData: any): AIAnalysisResult {
    try {
      // Extract the content from Deepseek response
      const responseContent = responseData?.choices?.[0]?.message?.content || '';
      
      // Try to parse JSON from the response
      const jsonResponse = JSON.parse(responseContent);
      
      return {
        risk: this.validateRisk(jsonResponse.risk),
        reasons: Array.isArray(jsonResponse.reasons) ? jsonResponse.reasons : ['No specific reasons provided'],
        confidenceScore: typeof jsonResponse.confidenceScore === 'number' ? jsonResponse.confidenceScore : 0.5
      };
    } catch (error) {
      console.error('Error parsing Deepseek response:', error);
      return {
        risk: SecurityRisk.MEDIUM,
        reasons: ['Error parsing AI analysis'],
        confidenceScore: 0.5
      };
    }
  }

  /**
   * Validate risk level from API response
   * @param risk - Risk level from API
   * @returns Validated risk level
   */
  private validateRisk(risk: string): SecurityRisk {
    const validRisks = Object.values(SecurityRisk);
    const upperRisk = risk?.toUpperCase() || '';
    
    // Find matching risk level
    for (const validRisk of validRisks) {
      if (String(validRisk).toUpperCase() === upperRisk) {
        return validRisk as SecurityRisk;
      }
    }
    
    // Default to medium if not found
    return SecurityRisk.MEDIUM;
  }
} 