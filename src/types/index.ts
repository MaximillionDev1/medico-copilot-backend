

export interface TranscriptionRequest {
  audio?: Express.Multer.File;
  text?: string;
  language?: string;
}

export interface TranscriptionResponse {
  success: boolean;
  transcript: string;
  confidence?: number;
  duration?: number;
  timestamp: string;
}

export interface DiagnosisRequest {
  transcript: string;
  patientAge?: number;
  patientGender?: string;
  symptoms?: string[];
}

export interface DiagnosisResponse {
  success: boolean;
  diagnostico: string;
  doencas: string[];
  exames: string[];
  medicamentos: string[];
  observacoes: string;
  confianca?: number;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  timestamp: string;
}

export interface AIProviderConfig {
  provider: 'claude' | 'openai' | 'groq';
  apiKey: string;
  model: string;
}