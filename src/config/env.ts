/**
 * Configuração de variáveis de ambiente
 * Valida e exporta configurações necessárias para a aplicação
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Schema de validação das variáveis de ambiente
const envSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
});

// Validação e parse das variáveis
const env = envSchema.parse(process.env);

export const config = {
  port: parseInt(env.PORT, 10),
  nodeEnv: env.NODE_ENV,
  anthropicApiKey: env.ANTHROPIC_API_KEY,
  openaiApiKey: env.OPENAI_API_KEY,
  allowedOrigins: env.ALLOWED_ORIGINS.split(','),
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
};

// Verificar se pelo menos uma API key está configurada
if (!config.anthropicApiKey && !config.openaiApiKey) {
  console.warn('⚠️  Nenhuma API key configurada. Sistema funcionará em modo mock.');
}