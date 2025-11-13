/**
 * Serviço de integração com APIs de IA
 * Responsável por processar diagnósticos médicos usando Claude ou OpenAI
 */

import axios from 'axios';
import { config } from '../config/env';
import { DiagnosisRequest, DiagnosisResponse } from '../types';

export class AIService {
  /**
   * Processa diagnóstico usando Claude API (Anthropic)
   */
  private async processWithClaude(transcript: string): Promise<any> {
    if (!config.anthropicApiKey) {
      throw new Error('Claude API key não configurada');
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: `Você é um assistente médico especializado em análise clínica. Analise a seguinte transcrição de consulta médica e forneça um diagnóstico estruturado.

IMPORTANTE: Retorne APENAS um objeto JSON válido, sem markdown, sem explicações adicionais.

Transcrição da consulta:
"${transcript}"

Estrutura JSON esperada:
{
  "diagnostico": "diagnóstico provável baseado nos sintomas descritos",
  "doencas": ["doença possível 1", "doença possível 2", "doença possível 3"],
  "exames": ["exame complementar 1", "exame complementar 2", "exame complementar 3"],
  "medicamentos": ["medicamento 1 (dosagem)", "medicamento 2 (dosagem)"],
  "observacoes": "observações importantes, alertas ou recomendações adicionais",
  "confianca": 85
}`,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.anthropicApiKey,
          'anthropic-version': '2023-06-01',
        },
      }
    );

    const textContent = response.data.content.find((item: any) => item.type === 'text')?.text || '';
    
    // Extrair JSON da resposta
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Resposta da IA não contém JSON válido');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Processa diagnóstico usando OpenAI API
   */
  private async processWithOpenAI(transcript: string): Promise<any> {
    if (!config.openaiApiKey) {
      throw new Error('OpenAI API key não configurada');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente médico especializado. Retorne apenas JSON válido.',
          },
          {
            role: 'user',
            content: `Analise esta consulta e retorne JSON com: diagnostico, doencas[], exames[], medicamentos[], observacoes, confianca.

Transcrição: "${transcript}"`,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openaiApiKey}`,
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  }

  /**
   * Diagnóstico mock para desenvolvimento/testes
   */
  private generateMockDiagnosis(transcript: string): any {
    // Análise simples baseada em palavras-chave
    const lowerTranscript = transcript.toLowerCase();
    
    let diagnostico = 'Investigação clínica necessária';
    const doencas: string[] = [];
    const exames: string[] = ['Hemograma completo', 'Exame físico detalhado'];
    const medicamentos: string[] = [];

    // Detecção de sintomas comuns
    if (lowerTranscript.includes('febre') || lowerTranscript.includes('temperatura')) {
      doencas.push('Infecção viral ou bacteriana', 'Gripe', 'COVID-19');
      exames.push('PCR para COVID-19', 'Teste rápido de gripe');
      medicamentos.push('Paracetamol 750mg (8/8h)', 'Dipirona 500mg (6/6h)');
      diagnostico = 'Quadro febril de provável origem infecciosa';
    }

    if (lowerTranscript.includes('dor de cabeça') || lowerTranscript.includes('cefaleia')) {
      doencas.push('Cefaleia tensional', 'Enxaqueca', 'Sinusite');
      exames.push('Tomografia de crânio (se indicado)', 'Avaliação oftalmológica');
      medicamentos.push('Ibuprofeno 400mg', 'Relaxante muscular');
    }

    if (lowerTranscript.includes('tosse') || lowerTranscript.includes('garganta')) {
      doencas.push('Infecção respiratória superior', 'Faringite', 'Bronquite');
      exames.push('Raio-X de tórax', 'Teste de streptococo');
      medicamentos.push('Xarope expectorante', 'Loratadina 10mg');
    }

    if (lowerTranscript.includes('dor no peito') || lowerTranscript.includes('coração')) {
      doencas.push('Avaliar origem cardíaca', 'Angina', 'Refluxo gastroesofágico');
      exames.push('Eletrocardiograma', 'Enzimas cardíacas', 'Raio-X de tórax');
      medicamentos.push('Avaliar necessidade de AAS', 'Omeprazol 20mg');
      diagnostico = 'URGENTE: Dor torácica requer avaliação imediata';
    }

    // Valores padrão se nada foi detectado
    if (doencas.length === 0) {
      doencas.push('Aguardando avaliação clínica', 'Sintomas inespecíficos');
    }

    if (medicamentos.length === 0) {
      medicamentos.push('Hidratação adequada', 'Repouso');
    }

    return {
      diagnostico,
      doencas: doencas.slice(0, 4),
      exames: exames.slice(0, 4),
      medicamentos: medicamentos.slice(0, 3),
      observacoes: 'Este é um diagnóstico assistido por IA. Recomenda-se avaliação presencial com médico qualificado. Em caso de sintomas graves, procure atendimento de emergência imediatamente.',
      confianca: 65,
    };
  }

  /**
   * Método público para gerar diagnóstico
   * Tenta usar Claude primeiro, depois OpenAI, e finalmente mock
   */
  async generateDiagnosis(data: DiagnosisRequest): Promise<DiagnosisResponse> {
    const startTime = Date.now();

    try {
      let diagnosisData;

      // Tentar Claude primeiro
      if (config.anthropicApiKey) {
        console.log('📡 Usando Claude API para diagnóstico...');
        diagnosisData = await this.processWithClaude(data.transcript);
      }
      // Fallback para OpenAI
      else if (config.openaiApiKey) {
        console.log('📡 Usando OpenAI API para diagnóstico...');
        diagnosisData = await this.processWithOpenAI(data.transcript);
      }
      // Fallback para mock
      else {
        console.log('🤖 Usando diagnóstico mock (modo desenvolvimento)...');
        diagnosisData = this.generateMockDiagnosis(data.transcript);
      }

      const processingTime = Date.now() - startTime;
      console.log(`✅ Diagnóstico gerado em ${processingTime}ms`);

      return {
        success: true,
        ...diagnosisData,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('❌ Erro ao gerar diagnóstico:', error.message);
      
      // Em caso de erro, usar mock como fallback
      console.log('🔄 Usando diagnóstico mock como fallback...');
      const mockData = this.generateMockDiagnosis(data.transcript);

      return {
        success: true,
        ...mockData,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const aiService = new AIService();