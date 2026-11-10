# 🐾 VetCare API - Sistema de Gestão Veterinária

## 📖 Descrição do Projeto

A **VetCare API** é o *back-end* da plataforma de gestão de clínicas veterinárias **VetCare**. Desenvolvida com o framework **NestJS** (Express) e **TypeScript**, a API adota uma arquitetura em camadas segura, desacoplada e fortemente tipada, integrada ao banco de dados relacional **PostgreSQL** por meio do **Prisma ORM**.

A solução suporta as principais operações operacionais e clínicas da instituição:

- **Autenticação & Controle de Acesso (RBAC):** autenticação *stateless* com **JWT**, senhas criptografadas via **bcrypt** e controle de permissões por papéis (**ADMIN**, **Veterinário** e **Recepcionista**).
- **Gestão de Usuários:** manutenção completa de operadores, com suporte à desativação de conta e envio automatizado de credenciais via **Nodemailer**.
- **Gestão de Tutores e Animais:** cadastro unificado (Tutor + Animal na mesma requisição), vínculo posterior de novos animais e preservação de histórico via **soft-delete**.
- **Agendamentos & Consultas:** controle da agenda médica com validação de conflitos de horário (*double-booking*).
- **Procedimentos & Prontuários:** registros imutáveis de atendimentos, exames diagnósticos e aplicação de vacinas.

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Framework | NestJS (Express) |
| Linguagem | TypeScript |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | JWT + bcrypt |
| E-mails | Nodemailer (Ethereal em desenvolvimento) |
| Infraestrutura local | Docker + Docker Compose |

---

## ⚠️ Pré-requisitos

> **AVISO OBRIGATÓRIO:** para rodar a aplicação localmente, é **indispensável ter o Docker instalado e em execução** no seu sistema. O banco de dados PostgreSQL é provisionado via contêiner Docker.

Além disso, é necessário ter instalado:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- npm

---

## 🚀 Passo a Passo para Rodar Localmente

Execute os comandos abaixo no terminal, a partir da pasta raiz do projeto.

### 1. Instalar as dependências

Baixe todas as dependências listadas no `package.json`:

```bash
npm install
```

### 2. Configurar as variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto a partir do `.env.example`:

```bash
# Linux/macOS
cp .env.example .env

# Windows (PowerShell)
copy .env.example .env
```

> Você também pode criar o `.env` manualmente e colar as variáveis presentes no `.env.example`.

### 3. Iniciar os serviços no Docker

Com o Docker em execução, suba o contêiner do banco de dados em segundo plano:

```bash
docker-compose up -d
```

### 4. Executar as migrações do banco de dados (Prisma)

Aplique as *migrations* para criar o esquema de tabelas e relacionamentos no PostgreSQL:

```bash
npx prisma migrate dev
```

### 5. Popular o banco de dados (Seed)

Execute o script de população inicial para cadastrar os dados de teste e os usuários iniciais:

```bash
npx tsx src/prisma/seed.ts
```

### 6. Iniciar a API em modo de desenvolvimento

Inicie a aplicação NestJS com recarregamento automático (*watch mode*):

```bash
npx nest start --watch
```

Após a execução, a API estará disponível em `http://localhost:3000` (ou na porta definida no `.env`).

---

## 🔐 Credenciais de Teste & Acesso

Após popular o banco de dados com o `seed.ts`, utilize as credenciais abaixo para autenticação.

### 👤 Acesso Administrador

| Campo | Valor |
| --- | --- |
| **Usuário** | `admin@vetcare.com` |
| **Senha** | `ADMIN` |

### 📧 Caixa de E-mails de Teste (Ethereal Email)

Para visualizar os e-mails de convite e notificações enviados pelo **Nodemailer**, acesse o [Ethereal Email](https://ethereal.email/messages) com os dados abaixo:

| Campo | Valor |
| --- | --- |
| **Usuário** | `jared.kihn@ethereal.email` |
| **Senha** | `jwpaj5WaYhapYXaMzA` |

> ⚠️ Estas credenciais são exclusivas para ambiente de desenvolvimento e testes. Nunca utilize dados reais ou senhas de produção neste arquivo.

