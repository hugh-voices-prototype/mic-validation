import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import QualityResults from './components/QualityResults';
import Header from './components/Header';
import Footer from './components/Footer';
import { QualityResult } from './types';
import { analyzeAudioQuality } from './services/apiService';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [qualityResult, setQualityResult] = useState<QualityResult | null>(null);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeAudioQuality(audioBlob);
      setQualityResult(result);
    } catch (error) {
      console.error('Error analyzing audio:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetApp = () => {
    setQualityResult(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      
      <main className="flex-grow py-8 px-4 lg:px-0">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Record Your Audio
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Speak into your microphone to record audio. We'll analyze the quality and 
              provide recommendations for improvement if needed.
            </p>
          </div>
          
          <div className="space-y-8">
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            
            {isAnalyzing && (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-2"></div>
                <p className="text-gray-600">Analyzing audio quality...</p>
              </div>
            )}
            
            {qualityResult && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Audio Quality Analysis
                  </h2>
                  <p className="text-gray-600 max-w-xl mx-auto">
                    Here's our assessment of your recording quality and recommendations for improvement.
                  </p>
                </div>
                
                <QualityResults result={qualityResult} onReset={resetApp} />
              </div>
            )}
          </div>
          
          <div className="mt-16 bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4">Tips for Better Audio Quality</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-2">Minimize Background Noise</h4>
                <p className="text-gray-600 text-sm">
                  Record in a quiet environment away from fans, air conditioners, and street noise.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-2">Use Proper Microphone Technique</h4>
                <p className="text-gray-600 text-sm">
                  Keep a consistent distance from the microphone, typically 6-8 inches away.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-2">Consider Room Acoustics</h4>
                <p className="text-gray-600 text-sm">
                  Avoid rooms with hard surfaces that create echo. Soft furnishings help absorb sound.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-2">Invest in Good Equipment</h4>
                <p className="text-gray-600 text-sm">
                  A quality microphone and audio interface makes a significant difference in clarity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;