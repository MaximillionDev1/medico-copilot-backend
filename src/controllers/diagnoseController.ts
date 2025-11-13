/**
 * Controller para endpoint de diagnóstico
 */

import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/aiService';
import { DiagnosisRequest } from '../types';

export class DiagnoseController {
  async diagnose(req: Request, res: Response, next: NextFunction) {
    try {
      const data: DiagnosisRequest = {
        transcript: req.body.transcript,
        patientAge: req.body.patientAge,
        patientGender: req.body.patientGender,
        symptoms: req.body.symptoms,
      };

      // Validação básica
      if (!data.transcript || data.transcript.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Transcrição não pode estar vazia',
          timestamp: new Date().toISOString(),
        });
      }

      console.log(`📝 Processando diagnóstico para transcrição de ${data.transcript.length} caracteres...`);

      const result = await aiService.generateDiagnosis(data);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const diagnoseController = new DiagnoseController();