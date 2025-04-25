export interface RecordingState {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  recordingTime: number;
}

export interface QualityResult {
  isHighQuality: boolean;
  score: number;
  message: string;
}

export interface ApiResponse {
  quality: {
    isHighQuality: boolean;
    score: number;
  };
  message: string;
}