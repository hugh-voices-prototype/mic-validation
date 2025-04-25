/**
 * Formats recording time in seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
};

/**
 * Creates an audio context and analyzes frequency data from audio stream
 */
export const createAudioAnalyzer = (stream: MediaStream): { 
  analyser: AnalyserNode; 
  getFrequencyData: () => Uint8Array; 
} => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);
  
  source.connect(analyser);
  analyser.fftSize = 256;
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  const getFrequencyData = () => {
    analyser.getByteFrequencyData(dataArray);
    return dataArray;
  };
  
  return { analyser, getFrequencyData };
};

/**
 * Calculates average audio level from frequency data
 */
export const calculateAudioLevel = (frequencyData: Uint8Array): number => {
  const sum = frequencyData.reduce((acc, val) => acc + val, 0);
  return sum / frequencyData.length / 255; // Normalize to 0-1
};