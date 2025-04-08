import React from 'react';
import { ScanResult, SecurityRisk } from '../utils/types';

interface ScanResultDisplayProps {
  result: ScanResult;
}

const ScanResultDisplay: React.FC<ScanResultDisplayProps> = ({ result }) => {
  // Get style based on risk level
  const getRiskStyle = (risk: SecurityRisk) => {
    switch (risk) {
      case 'critical':
        return {
          bgColor: 'bg-umbrella-danger',
          textColor: 'text-white',
          icon: '⚠️',
          title: 'Critical Risk Detected'
        };
      case 'high':
        return {
          bgColor: 'bg-umbrella-secondary',
          textColor: 'text-white',
          icon: '⚠️',
          title: 'High Risk Detected'
        };
      case 'medium':
        return {
          bgColor: 'bg-umbrella-warning',
          textColor: 'text-black',
          icon: '⚠️',
          title: 'Medium Risk Detected'
        };
      case 'low':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          icon: '⚠️',
          title: 'Low Risk Detected'
        };
      case 'safe':
      default:
        return {
          bgColor: 'bg-umbrella-success',
          textColor: 'text-white',
          icon: '✓',
          title: 'Website is Safe'
        };
    }
  };

  const style = getRiskStyle(result.risk);
  const date = new Date(result.timestamp).toLocaleString();

  return (
    <div className="flex flex-col">
      <div className={`${style.bgColor} ${style.textColor} p-4 rounded-t-lg`}>
        <div className="flex items-center">
          <span className="text-2xl mr-2">{style.icon}</span>
          <h2 className="text-lg font-bold">{style.title}</h2>
        </div>
        <p className="text-sm mt-1">Confidence: {(result.confidenceScore * 100).toFixed(0)}%</p>
      </div>

      <div className="border border-t-0 rounded-b-lg p-4">
        <h3 className="font-medium mb-2">Details:</h3>
        <ul className="list-disc list-inside space-y-1">
          {result.reasons.map((reason, index) => (
            <li key={index} className="text-sm">{reason}</li>
          ))}
        </ul>

        <div className="mt-4 text-xs text-gray-500">
          <p>Scanned: {date}</p>
          <p className="truncate">URL: {result.url}</p>
        </div>

        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm"
          >
            Scan Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanResultDisplay; 