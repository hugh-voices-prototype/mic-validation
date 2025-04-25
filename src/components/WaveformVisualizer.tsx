import React, { useRef, useEffect } from 'react';
import { calculateAudioLevel } from '../utils/audioUtils';

interface WaveformVisualizerProps {
  isRecording: boolean;
  frequencyData: Uint8Array | null;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ 
  isRecording, 
  frequencyData 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  // Store previous audio levels for smooth animation
  const dataPointsRef = useRef<number[]>(Array(100).fill(0));
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawWaveform = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isRecording && frequencyData) {
        // Calculate audio level from frequency data (0-1)
        const audioLevel = calculateAudioLevel(frequencyData);
        
        // Add new data point and remove oldest
        dataPointsRef.current.push(audioLevel);
        dataPointsRef.current.shift();
        
        // Draw the waveform
        const barWidth = canvas.width / dataPointsRef.current.length;
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#10B981'; // Green color
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'; // Transparent green
        
        ctx.beginPath();
        
        // Start from the bottom middle
        ctx.moveTo(0, canvas.height);
        
        // Draw left half of waveform (mirrored)
        dataPointsRef.current.slice(0, dataPointsRef.current.length / 2).forEach((level, i) => {
          const x = i * barWidth * 2;
          const y = canvas.height - (level * canvas.height * 0.8);
          ctx.lineTo(x, y);
        });
        
        // Draw right half of waveform (mirrored from left)
        dataPointsRef.current.slice(0, dataPointsRef.current.length / 2)
          .reverse()
          .forEach((level, i) => {
            const x = canvas.width - (i * barWidth * 2);
            const y = canvas.height - (level * canvas.height * 0.8);
            ctx.lineTo(x, y);
          });
          
        // Complete the path back to the start
        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();
        ctx.fill();
      } else {
        // Draw flat line when not recording
        ctx.strokeStyle = '#6B7280';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
      
      animationRef.current = requestAnimationFrame(drawWaveform);
    };
    
    drawWaveform();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording, frequencyData]);
  
  return (
    <div className="w-full h-32 mb-6">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full rounded-lg bg-gray-900"
        width={600}
        height={150}
      />
    </div>
  );
};

export default WaveformVisualizer;