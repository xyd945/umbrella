import React, { useEffect, useState } from 'react';
import { ScanResult, SecurityRisk, AIProvider, AIConfig } from '../utils/types';
import { storageUtil } from '../utils/storage';
import ScanResultDisplay from './ScanResultDisplay';

const Popup: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [config, setConfig] = useState<AIConfig | null>(null);

  useEffect(() => {
    // Load the current AI configuration
    const loadConfig = async () => {
      const aiConfig = await storageUtil.getConfig();
      setConfig(aiConfig);
    };

    // Get the current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });

    loadConfig();
  }, []);

  // Check if the current URL has been scanned before
  useEffect(() => {
    if (currentUrl) {
      const checkPreviousScan = async () => {
        const history = await storageUtil.getScanHistory();
        const previousScan = history.find(scan => scan.url === currentUrl);
        if (previousScan) {
          setScanResult(previousScan);
        }
      };
      
      checkPreviousScan();
    }
  }, [currentUrl]);

  // Function to scan the current website
  const scanWebsite = () => {
    setScanning(true);
    chrome.runtime.sendMessage({ action: 'scanWebsite' }, (response) => {
      if (response && !response.error) {
        setScanResult(response);
      }
      setScanning(false);
    });
  };

  // Render the security risk badge
  const renderRiskBadge = (risk: SecurityRisk) => {
    const riskColors = {
      safe: 'bg-umbrella-success',
      low: 'bg-green-500',
      medium: 'bg-umbrella-warning',
      high: 'bg-umbrella-secondary',
      critical: 'bg-umbrella-danger',
    };

    const riskLabels = {
      safe: 'SAFE',
      low: 'LOW RISK',
      medium: 'MEDIUM RISK',
      high: 'HIGH RISK',
      critical: 'CRITICAL RISK',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${riskColors[risk]}`}>
        {riskLabels[risk]}
      </span>
    );
  };

  return (
    <div className="flex flex-col p-4 min-h-[300px] w-full bg-white">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-umbrella-primary">Umbrella Security Scanner</h1>
      </header>

      <main className="flex-1">
        {scanResult ? (
          <ScanResultDisplay result={scanResult} />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <p className="text-gray-600 text-center">
              Scan this website to check for potential security threats, scams, or phishing attempts.
            </p>
            
            <button
              onClick={scanWebsite}
              disabled={scanning}
              className="px-4 py-2 bg-umbrella-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {scanning ? 'Scanning...' : 'Scan Website'}
            </button>
          </div>
        )}
      </main>

      <footer className="mt-4 text-xs text-gray-500 text-center border-t pt-2">
        <p>Using AI Provider: {config?.provider || 'Default'}</p>
      </footer>
    </div>
  );
};

export default Popup; 