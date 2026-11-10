
---

```markdown
# 🐾 VetCare API - Sistema de Gestão Veterinária

## 📖 Descrição do Projeto

A **VetCare API** é o *back-end* da plataforma de gestão de clínicas veterinárias **VetCare**. Desenvolvida utilizando o framework **NestJS** (Express) com **TypeScript**, a API adota uma arquitetura em camadas segura, desacoplada e fortemente tipada, integrada ao banco de dados relacional **PostgreSQL** por meio do **Prisma ORM**.

A solução suporta as principais operações operacionais e clínicas da instituição:
* **Autenticação & Controle de Acesso (RBAC):** Autenticação *stateless* com **JWT**, senhas criptografadas via **bcrypt** e controle de permissões por papéis (**ADMIN**, **Veterinário**, **Recepcionista**).
* **Gestão de Usuários:** Manutenção completa de operadores com suporte à desativação de conta e disparo automatizado de credenciais via **Nodemailer**.
* **Gestão de Tutores e Animais:** Cadastro unificado (Tutor + Animal na mesma requisição), vínculo posterior de novos animais e preservação de histórico via **soft-delete**.
* **Agendamentos & Consultas:** Controle de agenda médica com validação de conflitos de horário (*double-booking*).
* **Procedimentos & Prontuários:** Registros imutáveis de atendimentos, exames diagnósticos e aplicação de vacinas.

---

## ⚠️ Pré-requisitos

> **AVISO OBRIGATÓRIO:** Para rodar a aplicação localmente, é **indispensável ter o Docker e o Docker Compose instalados e em execução** no seu sistema. O banco de dados PostgreSQL é provisionado via contêiner Docker.

---

## 🚀 Passo a Passo para Rodar Localmente

Siga as instruções abaixo executando os comandos destacados no seu terminal a partir da pasta raiz do projeto.

### 1. Instalar as dependências
Execute no terminal para baixar todas as dependências listadas no `package.json`:
```bash
npm install
```

### 2. Configurar o arquivo de variáveis de ambiente
Crie um arquivo `.env` na pasta raiz do projeto e copie as configurações do arquivo `.env.example`:
```bash
# No terminal (Linux/macOS):
cp .env.example .env

# No terminal (Windows PowerShell):
copy .env.example .env
```
*(Você também pode criar o arquivo `.env` manualmente na raiz e colar as variáveis presentes em `.env.example`).*

### 3. Iniciar os serviços no Docker
Com o serviço do Docker rodando na máquina, suba o contêiner do banco de dados em segundo plano executando no terminal:
```bash
docker-compose up -d
```

### 4. Executar as migrações do banco de dados (Prisma)
Aplique as *migrations* do Prisma no terminal para criar o esquema de tabelas e relacionamentos no PostgreSQL:
```bash
npx prisma migrate dev
```

### 5. Popular o banco de dados (Seed)
Execute o script de população inicial (*seed*) no terminal para cadastrar os dados de teste e usuários iniciais:
```bash
npx tsx src/prisma/seed.ts
```

### 6. Iniciar a API no modo desenvolvimento
Inicie a aplicação NestJS no terminal com suporte a recarregamento automático (*watch mode*):
```bash
nest start --watch
```

Após a execução, a API estará pronta para receber requisições em `http://localhost:3000` (ou na porta definida no arquivo `.env`).
```
---


## 🔐 Credenciais de Teste & Acesso

Após popular o banco de dados via `seed.ts`, utilize as credenciais padrão abaixo para autenticação:

### 👤 Acesso Administrador
* **Usuário:** `admin@vetcare.com`
* **Senha:** `ADMIN`

### 📧 Caixa de E-mails de Teste (Ethereal Email)
Para visualizar os e-mails de convite e notificações enviadas pelo **Nodemailer**, acesse a plataforma do [Ethereal Email] com os seguintes dados:
* **Usuário:** `jared.kihn@ethereal.email`
* **Senha:** `jwpaj5WaYhapYXaMzA`
```
```markdown
---

