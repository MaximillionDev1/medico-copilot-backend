/**
 * Servidor principal da aplicação
 * Configuração do Express, middlewares e inicialização
 * @author Matheus Vinicius Rodrigues da Silva
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

// Criar instância do Express
const app: Application = express();

// ========================================
// MIDDLEWARES DE SEGURANÇA
// ========================================

// Helmet: adiciona headers de segurança
app.use(helmet());

// CORS: configuração de origens permitidas
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requisições sem origin (mobile apps, Postman, etc)
      if (!origin) return callback(null, true);
      
      if (config.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origem não permitida pelo CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiting: proteção contra DDoS
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Muitas requisições. Tente novamente mais tarde.',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ========================================
// MIDDLEWARES DE PARSING
// ========================================

// Body parser: JSON e URL encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================================
// LOGGING DE REQUISIÇÕES
// ========================================

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ========================================
// ROTAS
// ========================================

// Rotas principais da API
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Médico Copilot API - Sistema de diagnóstico médico assistido por IA',
    version: '1.0.0',
    author: 'Matheus Vinicius Rodrigues da Silva',
    endpoints: {
      health: '/api/health',
      transcribe: '/api/transcribe',
      diagnose: '/api/diagnose',
    },
    documentation: 'https://github.com/seu-usuario/medico-copilot',
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: 'Rota não encontrada',
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// MIDDLEWARE DE ERRO GLOBAL
// ========================================

app.use(errorHandler);

// ========================================
// INICIALIZAÇÃO DO SERVIDOR
// ========================================

const startServer = async () => {
  try {
    app.listen(config.port, () => {
      console.log('\n🚀 ========================================');
      console.log('🏥 Médico Copilot API');
      console.log('========================================');
      console.log(`📡 Servidor rodando em: http://localhost:${config.port}`);
      console.log(`🌍 Ambiente: ${config.nodeEnv}`);
      console.log(`🔑 Claude API: ${config.anthropicApiKey ? '✅ Configurada' : '❌ Não configurada'}`);
      console.log(`🔑 OpenAI API: ${config.openaiApiKey ? '✅ Configurada' : '❌ Não configurada'}`);
      console.log('========================================\n');
      
      if (!config.anthropicApiKey && !config.openaiApiKey) {
        console.log('⚠️  AVISO: Nenhuma API key configurada.');
        console.log('   O sistema funcionará em modo MOCK para desenvolvimento.');
        console.log('   Configure uma API key no arquivo .env para usar IA real.\n');
      }
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

export default app;