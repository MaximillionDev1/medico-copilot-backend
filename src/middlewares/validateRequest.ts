/**
 * Middleware de validação de requisições
 * Valida body, params e query usando Zod schemas
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Schemas de validação
export const diagnoseSchema = z.object({
  body: z.object({
    transcript: z.string().min(10, 'Transcrição deve ter pelo menos 10 caracteres'),
    patientAge: z.number().min(0).max(150).optional(),
    patientGender: z.enum(['M', 'F', 'Outro']).optional(),
    symptoms: z.array(z.string()).optional(),
  }),
});

export const transcribeSchema = z.object({
  body: z.object({
    text: z.string().optional(),
    language: z.string().optional(),
  }),
});