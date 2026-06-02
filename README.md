# 🏥 Médico Copilot — Backend

API que processa transcrições médicas e gera diagnósticos
assistidos por inteligência artificial.

Recebe o texto da consulta, interpreta os sintomas e retorna
hipóteses diagnósticas, exames sugeridos e conduta recomendada.

👉 Frontend da aplicação: https://github.com/MaximillionDev1/medico-copilot-frontend
🌐 Deploy: Em breve

---

## Como funciona

1. O frontend envia a transcrição da consulta
2. O backend valida e processa a requisição
3. A IA analisa os sintomas e gera o diagnóstico estruturado
4. A resposta volta para o frontend em JSON

Se a IA principal estiver indisponível, o sistema muda
automaticamente para uma alternativa — sem quebrar o fluxo.

Em ambiente de desenvolvimento, um modo mock simula os diagnósticos
localmente, sem depender de API externa e sem custo.

---

## Tecnologias

- Node.js + TypeScript
- Express
- Anthropic Claude API (IA principal)
- OpenAI API (fallback)
- Zod (validação)
- Helmet + Rate Limiting (segurança)

---

## Como rodar localmente

### 1. Clone o repositório
git clone https://github.com/MaximillionDev1/medico-copilot-backend
cd medico-copilot-backend

### 2. Instale as dependências
npm install

### 3. Configure o ambiente
cp .env.example .env

# Edite o .env:
# PORT=3001
# ANTHROPIC_API_KEY=sua-chave (opcional — sem ela, roda em modo mock)
# OPENAI_API_KEY=sua-chave (opcional — fallback)
# ALLOWED_ORIGINS=http://localhost:5173

### 4. Rode o servidor
npm run dev
# Servidor em: http://localhost:3001

> Sem API key configurada, o sistema roda em modo mock automaticamente.
> Útil para desenvolvimento e testes sem custo.

---

## Endpoints

### GET /api/health
Verifica se a API está no ar.

### POST /api/transcribe
Processa transcrição de texto ou áudio.

### POST /api/diagnose
Gera diagnóstico a partir da transcrição.
Body: { "transcript": "...", "patientAge": 35, "patientGender": "M" }

---

## Estrutura do projeto

src/
├── config/        # Variáveis de ambiente
├── controllers/   # Lógica das rotas
├── services/      # Integração com IA
├── routes/        # Definição de endpoints
├── middlewares/   # Validação e erros
├── types/         # Tipos TypeScript
└── server.ts      # Entrada da aplicação

---

## Próximos passos

- [ ] Autenticação JWT
- [ ] Persistência em banco de dados (PostgreSQL)
- [ ] WebSocket para streaming de resposta
- [ ] Testes unitários e de integração
- [ ] Documentação Swagger

---

## Contato

Matheus Vinicius Rodrigues da Silva
matheusdevsilv4@gmail.com
linkedin.com/in/matheus-vinicius-dev
