import React from 'react';
import { QualityResult } from '../types';
import { getEquipmentRecommendations } from '../services/apiService';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface QualityResultsProps {
  result: QualityResult;
  onReset: () => void;
}

const QualityResults: React.FC<QualityResultsProps> = ({ result, onReset }) => {
  const recommendations = getEquipmentRecommendations(result.score);

  // Determine the color based on quality score
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Determine the background based on quality score
  const getBgColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-50 border-emerald-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`rounded-xl p-6 shadow-md mb-6 ${getBgColor(result.score)}`}>
        <div className="flex items-center mb-4">
          {result.isHighQuality ? (
            <CheckCircle className="text-emerald-500 mr-3" size={24} />
          ) : (
            <AlertCircle className="text-red-500 mr-3" size={24} />
          )}
          <h2 className="text-xl font-semibold">
            {result.isHighQuality ? 'High Quality Audio' : 'Audio Quality Needs Improvement'}
          </h2>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Quality Score</span>
            <span className={`font-bold ${getScoreColor(result.score)}`}>
              {result.score}/100
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                result.score >= 70 ? 'bg-emerald-500' : 
                result.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${result.score}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{result.message}</p>
        
        <button
          onClick={onReset}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Record Again
        </button>
      </div>
      
      {!result.isHighQuality && recommendations.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recommended Equipment</h3>
          <div className="space-y-4">
            {recommendations.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="mb-2 sm:mb-0">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-gray-500">{item.price}</p>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors inline-block text-center"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityResults;