# 🏥 Médico Copilot - Backend API

Sistema backend para diagnóstico médico assistido por IA, desenvolvido com Node.js, TypeScript e Express.

**Desenvolvedor:** Matheus Vinicius Rodrigues da Silva  
**Teste Técnico:** MedNote.IA

---

## 🚀 Tecnologias

- **Node.js** (v18+)
- **TypeScript** (v5)
- **Express.js** (Framework web)
- **Anthropic Claude API** (IA principal)
- **OpenAI API** (Fallback)
- **Zod** (Validação)
- **Multer** (Upload de arquivos)
- **Helmet** (Segurança)
- **Express Rate Limit** (Proteção DDoS)

---

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone 
cd backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas API keys:
```env
PORT=3001
NODE_ENV=development

# Pelo menos uma dessas APIs deve estar configurada
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-...

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Execute o servidor

**Modo desenvolvimento (com hot reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm run build
npm start
```

O servidor estará disponível em: **http://localhost:3001**

---

## 📡 Endpoints da API

### **GET /api/health**
Health check da API

**Resposta:**
```json
{
  "success": true,
  "message": "API está funcionando corretamente",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

---

### **POST /api/transcribe**
Processa transcrição de áudio ou texto

**Body (JSON):**
```json
{
  "text": "Paciente relata dor de cabeça há 3 dias...",
  "language": "pt-BR"
}
```

**Ou enviar arquivo de áudio:**
```bash
curl -X POST http://localhost:3001/api/transcribe \
  -F "audio=@consulta.mp3"
```

**Resposta:**
```json
{
  "success": true,
  "transcript": "Paciente relata dor de cabeça há 3 dias...",
  "confidence": 0.95,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### **POST /api/diagnose**
Gera diagnóstico baseado na transcrição

**Body (JSON):**
```json
{
  "transcript": "Paciente do sexo masculino, 35 anos, relata febre alta (39°C) há 2 dias, dor de garganta intensa, dificuldade para engolir e mal-estar generalizado.",
  "patientAge": 35,
  "patientGender": "M"
}
```

**Resposta:**
```json
{
  "success": true,
  "diagnostico": "Quadro clínico sugestivo de faringite bacteriana aguda (possível estreptococcia)",
  "doencas": [
    "Faringite estreptocócica",
    "Amigdalite bacteriana",
    "Mononucleose infecciosa"
  ],
  "exames": [
    "Teste rápido de estreptococo",
    "Hemograma completo",
    "Cultura de orofaringe"
  ],
  "medicamentos": [
    "Amoxicilina 500mg (8/8h por 10 dias)",
    "Paracetamol 750mg (6/6h)",
    "Anti-inflamatório (Ibuprofeno 400mg)"
  ],
  "observacoes": "Recomenda-se repouso, hidratação adequada e retorno em 48h se não houver melhora. Em caso de dificuldade respiratória, procurar emergência imediatamente.",
  "confianca": 85,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔒 Segurança

- ✅ **Helmet**: Headers de segurança HTTP
- ✅ **CORS**: Controle de origens permitidas
- ✅ **Rate Limiting**: 100 requisições por 15 minutos
- ✅ **Validação de entrada**: Zod schemas
- ✅ **Error handling**: Tratamento global de erros

---

## 🧪 Testes
```bash
# Testar health check
curl http://localhost:3001/api/health

# Testar diagnóstico
curl -X POST http://localhost:3001/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"transcript":"Paciente com febre e tosse"}'
```

---

## 📊 Modo Mock (Desenvolvimento)

Se nenhuma API key estiver configurada, o sistema funcionará em **modo mock**, gerando diagnósticos baseados em regras simples de detecção de sintomas. Perfeito para desenvolvimento e testes sem custos de API.

---

## 🛠️ Estrutura do Projeto
backend/
├── src/
│   ├── config/         # Configurações e variáveis de ambiente
│   ├── controllers/    # Controladores de rotas
│   ├── services/       # Lógica de negócio (IA, transcrição)
│   ├── routes/         # Definição de rotas
│   ├── middlewares/    # Middlewares (validação, erro)
│   ├── types/          # Tipos TypeScript
│   └── server.ts       # Servidor principal
├── .env.example        # Exemplo de configuração
├── package.json        # Dependências
└── tsconfig.json       # Configuração TypeScript

---

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | `3001` |
| `NODE_ENV` | Ambiente (development/production) | `development` |
| `ANTHROPIC_API_KEY` | Chave da API Claude | - |
| `OPENAI_API_KEY` | Chave da API OpenAI | - |
| `ALLOWED_ORIGINS` | Origens permitidas (CORS) | `http://localhost:5173` |

---

## 🎯 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar persistência (PostgreSQL/MongoDB)
- [ ] Implementar WebSockets para streaming
- [ ] Adicionar testes unitários e integração
- [ ] Documentação Swagger/OpenAPI
- [ ] Deploy em cloud (Railway/Render/Vercel)

---

## 📧 Contato

**Matheus Vinicius Rodrigues da Silva**  
Email: matheusdevsilv4@gmail.com
LinkedIn:linkedin.com/in/matheus-vinicius-dev

---

## 📄 Licença

MIT License - Livre para uso em projetos pessoais e comerciais.

✅ Checklist de Implementação

✅ Estrutura de pastas organizada
✅ TypeScript configurado com strict mode
✅ Validação de entrada com Zod
✅ Integração com Claude API
✅ Fallback para OpenAI API
✅ Modo mock para desenvolvimento
✅ Error handling robusto
✅ Segurança (Helmet, CORS, Rate Limiting)
✅ Logging de requisições
✅ README completo
✅ Código comentado e documentado


🚀 Executar o Backend
bash# 1. Entrar na pasta backend
cd backend

# 2. Instalar dependências
npm install

# 3. Configurar .env
cp .env.example .env
# Editar .env e adicionar sua ANTHROPIC_API_KEY

# 4. Rodar em desenvolvimento
npm run dev

# ✅ Servidor rodando em http://localhost:3001