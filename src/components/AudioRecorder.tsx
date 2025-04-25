import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Download } from 'lucide-react';
import { RecordingState } from '../types';
import { formatTime, createAudioAnalyzer } from '../utils/audioUtils';
import WaveformVisualizer from './WaveformVisualizer';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    audioBlob: null,
    audioUrl: null,
    recordingTime: 0,
  });
  
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const analyzerRef = useRef<{ 
    analyser: AnalyserNode; 
    getFrequencyData: () => Uint8Array; 
  } | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create audio analyzer
      analyzerRef.current = createAudioAnalyzer(stream);
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Clear previous recording data
      chunksRef.current = [];
      
      // Start recording
      mediaRecorder.start();
      
      // Update UI state
      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        audioBlob: null,
        audioUrl: null,
        recordingTime: 0,
      }));
      
      // Set up data handler
      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      
      // Set up recording completion handler
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecordingState(prev => ({
          ...prev,
          isRecording: false,
          audioBlob,
          audioUrl,
        }));
        
        onRecordingComplete(audioBlob);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingState(prev => ({
          ...prev,
          recordingTime: prev.recordingTime + 1,
        }));
      }, 1000);
      
      // Start analyzer animation
      updateFrequencyData();
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setPermissionDenied(true);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };
  
  const updateFrequencyData = () => {
    if (analyzerRef.current && recordingState.isRecording) {
      setFrequencyData(analyzerRef.current.getFrequencyData());
      animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
    }
  };
  
  const handleDownload = () => {
    if (recordingState.audioUrl && recordingState.audioBlob) {
      const a = document.createElement('a');
      a.href = recordingState.audioUrl;
      a.download = `recording-${new Date().toISOString()}.wav`;
      a.click();
    }
  };
  
  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (recordingState.audioUrl) {
        URL.revokeObjectURL(recordingState.audioUrl);
      }
    };
  }, [recordingState.audioUrl]);
  
  if (permissionDenied) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
        <p className="font-medium mb-2">Microphone access denied</p>
        <p className="text-sm">
          Please allow microphone access in your browser settings to use the recorder.
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg">
      <WaveformVisualizer 
        isRecording={recordingState.isRecording} 
        frequencyData={frequencyData}
      />
      
      <div className="flex flex-col items-center">
        <div className="text-2xl font-mono mb-4 text-white">
          {formatTime(recordingState.recordingTime)}
        </div>
        
        <div className="flex space-x-4 mb-6">
          {!recordingState.isRecording && !recordingState.audioBlob ? (
            <button
              onClick={startRecording}
              className="flex items-center justify-center w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Start Recording"
            >
              <Mic size={24} />
            </button>
          ) : recordingState.isRecording ? (
            <button
              onClick={stopRecording}
              className="flex items-center justify-center w-14 h-14 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Stop Recording"
            >
              <Square size={20} />
            </button>
          ) : null}
          
          {recordingState.audioUrl && (
            <>
              <button
                onClick={() => {
                  const audio = new Audio(recordingState.audioUrl);
                  audio.play();
                }}
                className="flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                aria-label="Play Recording"
              >
                <Play size={24} />
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                aria-label="Download Recording"
              >
                <Download size={24} />
              </button>
            </>
          )}
        </div>
        
        <div className="text-center text-gray-400 text-sm">
          {recordingState.isRecording ? (
            <p className="animate-pulse text-red-400">Recording in progress...</p>
          ) : recordingState.audioBlob ? (
            <p>Recording complete. You can play it back or analyze the quality.</p>
          ) : (
            <p>Click the microphone button to start recording</p>
          )}
        </div>
      </div>
      
      {recordingState.audioUrl && (
        <div className="mt-6">
          <audio 
            className="w-full mt-4" 
            src={recordingState.audioUrl} 
            controls 
          />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;