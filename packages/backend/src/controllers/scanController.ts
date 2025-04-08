import { Request, Response } from 'express';
import { AnalyzeRequest, AnalyzeResponse, SecurityRisk } from '@umbrella/types';
import { AIProviderFactory } from '../services/aiProviderFactory';

/**
 * Analyze website content
 * @param req - Express request
 * @param res - Express response
 */
export const analyzeWebsite = async (req: Request, res: Response) => {
  try {
    const { content, config } = req.body as AnalyzeRequest;
    
    // Validate request
    if (!content || !content.url || !content.text) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: 'Missing required website content data'
      });
    }

    // Get AI provider service
    const aiProvider = AIProviderFactory.getProvider(config.provider);
    
    // Analyze content
    const analysis = await aiProvider.analyzeContent(content);
    
    // Format response
    const response: AnalyzeResponse = {
      url: content.url,
      risk: (analysis.risk as SecurityRisk) || SecurityRisk.MEDIUM,
      timestamp: Date.now(),
      reasons: analysis.reasons || ['No specific reasons provided'],
      confidenceScore: analysis.confidenceScore || 0.5,
    };
    
    // Return analysis results
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error analyzing website:', error);
    return res.status(500).json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 