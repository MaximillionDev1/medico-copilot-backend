/**
 * Definição de todas as rotas da API
 * Centraliza endpoints e aplica middlewares
 */

import { Router } from 'express';
import multer from 'multer';
import { transcribeController } from '../controllers/transcribeController';
import { diagnoseController } from '../controllers/diagnoseController';
import { validateRequest, diagnoseSchema, transcribeSchema } from '../middlewares/validateRequest';

const router = Router();

// Configuração do Multer para upload de arquivos de áudio
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas arquivos de áudio
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de áudio são permitidos'));
    }
  },
});

/**
 * @route   GET /api/health
 * @desc    Health check da API
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API está funcionando corretamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

/**
 * @route   POST /api/transcribe
 * @desc    Transcreve áudio ou processa texto já transcrito
 * @access  Public
 * @body    { text?: string, language?: string } ou arquivo de áudio
 */
router.post(
  '/transcribe',
  upload.single('audio'),
  validateRequest(transcribeSchema),
  transcribeController.transcribe.bind(transcribeController)
);

/**
 * @route   POST /api/diagnose
 * @desc    Gera diagnóstico baseado na transcrição da consulta
 * @access  Public
 * @body    { transcript: string, patientAge?: number, patientGender?: string, symptoms?: string[] }
 */
router.post(
  '/diagnose',
  validateRequest(diagnoseSchema),
  diagnoseController.diagnose.bind(diagnoseController)
);

export default router;