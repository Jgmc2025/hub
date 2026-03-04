# 🚀 Hub Inteligente de Recursos Educacionais
Este projeto é uma aplicação Fullstack desenvolvida para centralizar e otimizar o gerenciamento de materiais didáticos. O diferencial estratégico é o Assistente de IA configurado como um **Assistente Pedagógico** para gerar descrições e tags automáticas, agilizando o trabalho de conteudistas.

## 💻 Compatibilidade Universal
O sistema foi desenvolvido com scripts universais que garantem o funcionamento idêntico em Windows (CMD/PowerShell), Linux e macOS.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Linguagem:** Python 3.12+
- **Framework:** FastAPI (RESTful API)
- **Validação:** Pydantic
- **ORM:** SQLAlchemy
- **Banco de Dados:** SQLite 
- **IA:** Integração com LLM via Groq

### Frontend
- **Framework:** React.js 
- **Estilização:** Tailwind CSS
- **Estado:** React Hooks e gerenciamento de *loading states* para IA

### DevOps & Observabilidade (Diferenciais)
- **CI:** Pipeline via GitHub Actions com Linting (Flake8)
- **Logs Estruturados:** Monitoramento de `TokenUsage` e `Latency`
- **Health Check:** Endpoint dedicado para verificação de status do sistema

## ✨ Funcionalidades
- [x] **CRUD de Recursos:** Cadastro, listagem com paginação, edição e exclusão de materiais
- [x] **Campos Suportados:** Título, Descrição, Tipo (Vídeo, PDF, Link), URL e Tags
- [x] **Smart Assist (IA):** Botão para geração automática de metadados pedagógicos
- [x] **Observabilidade:** Logs técnicos detalhados para cada requisição de IA
- [x] **Resiliência:** Tratamento de erros e mecanismo de *fallback* caso a API de IA falhe
- [x] **Segurança:** Gestão de API Keys via variáveis de ambiente (.env)

## 🏗️ Arquitetura e IA (Prompt Engineering)
O sistema utiliza um **Prompt de Sistema** eficiente para garantir que a IA responda em formato **JSON estrito**. A IA é instruída a atuar como um "Assistente Pedagógico", garantindo que as descrições sejam úteis e educativas para os alunos.
Exemplo de log estruturado gerado (conforme requisito):
`[INFO] AI Request: Title="Matemática Financeira", TokenUsage=150, Latency=1.2s`

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Python 3.10+
- Node.js 18+
- Git
- Uma API Key do Groq

### Clonar projeto do GitHub
1. No terminal, procure um local para adicionar o projeto
2. Digite **git clone https://github.com/Jgmc2025/hub.git**
3. Entre no arquivo: **cd hub**
4. Execute **npm run setup** para instalar todas as dependências
5. Adicione sua chave API do Groq na variável API_KEY dentro do arquivo .env no backend
6. Rode o projeto: **npm run dev**. Você será redirecionado para a página localhost:3000