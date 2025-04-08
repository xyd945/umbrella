import axios from 'axios';
import { WebsiteContent, SecurityRisk } from '@umbrella/types';
import { AIAnalysisResult, AIProviderService } from './aiProviderFactory';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Google Gemini AI Service implementation
 */
export class GeminiService implements AIProviderService {
  private apiKey: string;
  private endpoint: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.endpoint = process.env.GEMINI_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    if (!this.apiKey) {
      console.warn('Gemini API key not found. API calls will fail.');
    }
  }

  /**
   * Analyze website content using Gemini
   * @param content - Website content to analyze
   * @returns Analysis result
   */
  async analyzeContent(content: WebsiteContent): Promise<AIAnalysisResult> {
    try {
      // Create prompt for Gemini
      const prompt = this.createPrompt(content);
      
      // Make API request to Gemini
      const response = await axios.post(
        this.endpoint,
        {
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.apiKey
          }
        }
      );
      
      // Parse the response
      const result = this.parseResponse(response.data, content);
      return result;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Return a default result on error
      return {
        risk: SecurityRisk.MEDIUM,
        reasons: ['Failed to analyze website due to API error'],
        confidenceScore: 0.5
      };
    }
  }

  /**
   * Create a prompt for Gemini
   * @param content - Website content
   * @returns Formatted prompt
   */
  private createPrompt(content: WebsiteContent): string {
    return `Analyze this website for security threats, scams, or phishing attempts.
URL: ${content.url}
Title: ${content.title}
Content: ${content.text.substring(0, 2000)}...
Links: ${content.links.slice(0, 20).join(', ')}

Perform a comprehensive security analysis with these specific checks:

1. REPUTATION CHECK: Based on your knowledge, determine if this site has been reported for scams, fraud, or malicious activities. Consider if this URL appears on known blocklists or has negative reports online.

2. BRAND IMPERSONATION: If the site claims to represent or be affiliated with known companies (especially big brands like Apple, Microsoft, Amazon, banks, etc.), verify if the domain is legitimate. Look for:
   - Slight misspellings (e.g., "arnazon.com" instead of "amazon.com")
   - Domain variations (e.g., "microsoft-support.com" instead of "microsoft.com")
   - Unusual TLDs (e.g., ".xyz", ".online" instead of expected ".com", ".org")

3. LINK CONSISTENCY: Examine the external links (especially for About, Contact, Legal pages). Check if they:
   - Use the same domain as the main site
   - Redirect to unexpected domains
   - Mix HTTP and HTTPS protocols suspiciously

4. CONTENT ANALYSIS: Look for:
   - Urgency or pressure tactics
   - Claims of unrealistic rewards, prizes, or returns
   - Poor grammar or inconsistent language quality
   - Requests for personal/financial information
   - Limited or suspicious contact information

5. TECHNICAL INDICATORS: Consider:
   - Mismatched or missing SSL certificates
   - Newly registered domains
   - Unusual redirect chains
   - Use of URL shorteners for critical links

Please provide:
1. A security risk assessment (SAFE, LOW, MEDIUM, HIGH, or CRITICAL)
2. Specific reasons for your assessment (list at least 3 points with details)
3. A confidence score between 0 and 1 indicating how certain you are

Format your response as JSON with the following structure:
{
  "risk": "LOW", 
  "reasons": ["Reason 1", "Reason 2", "Reason 3"],
  "confidenceScore": 0.8
}`;
  }

  /**
   * Parse Gemini API response
   * @param responseData - Gemini API response data
   * @param content - Original website content
   * @returns Structured analysis result
   */
  private parseResponse(responseData: any, content: WebsiteContent): AIAnalysisResult {
    try {
      // Extract the text from Gemini response
      const responseText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Try to parse JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonResponse = JSON.parse(jsonMatch[0]);
        
        return {
          risk: this.validateRisk(jsonResponse.risk),
          reasons: Array.isArray(jsonResponse.reasons) ? jsonResponse.reasons : ['No specific reasons provided'],
          confidenceScore: typeof jsonResponse.confidenceScore === 'number' ? jsonResponse.confidenceScore : 0.5
        };
      }
      
      // If parsing failed, provide a generic response
      return {
        risk: SecurityRisk.MEDIUM,
        reasons: ['Unable to parse AI response properly'],
        confidenceScore: 0.5
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
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