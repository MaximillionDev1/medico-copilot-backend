/**
 * Middleware global de tratamento de erros
 * Captura e formata todos os erros da aplicação
 */

import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Erro capturado:', error);

  // Erro de validação Zod
  if (error.name === 'ZodError') {
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'VALIDATION_ERROR',
      message: error.errors.map((e: any) => e.message).join(', '),
      timestamp: new Date().toISOString(),
    };
    return res.status(400).json(errorResponse);
  }

  // Erro de API externa (Axios)
  if (error.isAxiosError) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'EXTERNAL_API_ERROR',
      message: error.response?.data?.error?.message || 'Erro ao comunicar com API externa',
      timestamp: new Date().toISOString(),
    };
    return res.status(502).json(errorResponse);
  }

  // Erro genérico
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: error.message || 'Erro interno do servidor',
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(errorResponse);
};