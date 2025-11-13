/**
 * Controller para endpoint de transcrição
 */

import { Request, Response, NextFunction } from 'express';
import { transcriptionService } from '../services/transcriptionService';
import { TranscriptionRequest } from '../types';

export class TranscribeController {
  async transcribe(req: Request, res: Response, next: NextFunction) {
    try {
      const data: TranscriptionRequest = {
        text: req.body.text,
        audio: req.file,
        language: req.body.language || 'pt-BR',
      };

      const result = await transcriptionService.transcribe(data);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const transcribeController = new TranscribeController();