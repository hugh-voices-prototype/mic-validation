import { ApiResponse, QualityResult } from '../types';

// Simulated API service since we don't have an actual endpoint
export const analyzeAudioQuality = async (audioBlob: Blob): Promise<QualityResult> => {
  try {
    // In a real application, we would upload the audio file to an API
    // For demo purposes, we'll simulate an API response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Random quality assessment for demo purposes
    // In production, replace with actual API call
    const isHighQuality = Math.random() > 0.5;
    const score = isHighQuality ? 
      Math.floor(70 + Math.random() * 30) : 
      Math.floor(20 + Math.random() * 50);
    
    const message = isHighQuality ?
      "Great job! Your audio meets professional quality standards." :
      "Your audio quality could be improved. Consider upgrading your equipment for better results.";
    
    return {
      isHighQuality,
      score,
      message
    };
    
    /* 
    // Example of a real API implementation:
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    
    const response = await fetch('https://api.example.com/analyze-audio', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze audio');
    }
    
    const data: ApiResponse = await response.json();
    
    return {
      isHighQuality: data.quality.isHighQuality,
      score: data.quality.score,
      message: data.message
    };
    */
  } catch (error) {
    console.error('Error analyzing audio:', error);
    return {
      isHighQuality: false,
      score: 0,
      message: 'An error occurred while analyzing your audio. Please try again.'
    };
  }
};

export const getEquipmentRecommendations = (qualityScore: number): { name: string; url: string; price: string }[] => {
  // Based on quality score, recommend different levels of equipment
  if (qualityScore < 30) {
    return [
      { 
        name: 'Blue Yeti USB Microphone', 
        url: 'https://www.amazon.com/Blue-Yeti-USB-Microphone-Silver/dp/B002VA464S', 
        price: '$129.99' 
      },
      { 
        name: 'Focusrite Scarlett Solo Audio Interface', 
        url: 'https://www.amazon.com/Focusrite-Scarlett-Audio-Interface-Tools/dp/B07QR6Z1JB', 
        price: '$119.99' 
      }
    ];
  } else if (qualityScore < 70) {
    return [
      { 
        name: 'Shure SM7B Vocal Microphone', 
        url: 'https://www.amazon.com/Shure-SM7B-Cardioid-Dynamic-Microphone/dp/B0002E4Z8M', 
        price: '$399.00' 
      },
      { 
        name: 'Cloudlifter CL-1 Mic Activator', 
        url: 'https://www.amazon.com/Cloud-Microphones-CL-1-Cloudlifter-1-channel/dp/B004MQSV04', 
        price: '$149.00' 
      }
    ];
  } else {
    return [
      { 
        name: 'Acoustic Treatment Panels', 
        url: 'https://www.amazon.com/acoustic-treatment-panels/s?k=acoustic+treatment+panels', 
        price: '$49.99+' 
      },
      { 
        name: 'Pop Filter', 
        url: 'https://www.amazon.com/s?k=microphone+pop+filter', 
        price: '$15.99+' 
      }
    ];
  }
};