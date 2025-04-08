/**
 * Shared type definitions for Umbrella Security Scanner
 */

// AI Provider Types
export enum AIProvider {
  GEMINI = 'gemini',
  DEEPSEEK = 'deepseek',
  // Add more providers as needed
}

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  endpoint: string;
}

// Scan Result Types
export enum SecurityRisk {
  SAFE = 'safe',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface ScanResult {
  url: string;
  risk: SecurityRisk;
  timestamp: number;
  reasons: string[];
  confidenceScore: number;
}

// Website Content Type
export interface WebsiteContent {
  url: string;
  title: string;
  text: string;
  links: string[];
  metadata: Record<string, string>;
}

// API Request/Response Types
export interface AnalyzeRequest {
  content: WebsiteContent;
  config: {
    provider: AIProvider;
  };
}

export interface AnalyzeResponse extends ScanResult {
  // Additional fields can be added here
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: string;
} 