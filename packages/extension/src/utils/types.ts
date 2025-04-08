// Re-export all types from shared package
export * from '@umbrella/types';

// Extension-specific types can be added here
export interface ExtensionSettings {
  enableAutoScan: boolean;
  notifyOnHighRisk: boolean;
  scanFrequency: 'always' | 'once' | 'daily';
}