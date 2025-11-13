/**
 * Serviço de transcrição de áudio
 * Processa arquivos de áudio e converte em texto
 */

import { TranscriptionRequest, TranscriptionResponse } from '../types';

export class TranscriptionService {
  /**
   * Transcreve áudio para texto
   * Nota: A transcrição real acontece no frontend via Web Speech API
   * Este endpoint aceita texto já transcrito ou poderia integrar com Whisper API
   */
  async transcribe(data: TranscriptionRequest): Promise<TranscriptionResponse> {
    // Se já recebeu texto transcrito, retornar direto
    if (data.text) {
      return {
        success: true,
        transcript: data.text,
        confidence: 0.95,
        timestamp: new Date().toISOString(),
      };
    }

    // Se recebeu arquivo de áudio, processar (implementação futura com Whisper)
    if (data.audio) {
      // TODO: Integrar com OpenAI Whisper API ou similar
      // Por enquanto, retornar mensagem de não implementado
      throw new Error('Transcrição de áudio via backend não implementada. Use Web Speech API no frontend.');
    }

    throw new Error('Nenhum áudio ou texto fornecido para transcrição');
  }
}

export const transcriptionService = new TranscriptionService();