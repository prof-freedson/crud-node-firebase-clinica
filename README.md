# Sistema CRUD de Pacientes - Firebase

Sistema completo de gerenciamento de pacientes desenvolvido com Node.js, Firebase, EJS e Body-Parser.

## 📋 Funcionalidades

- ✅ Criar novos pacientes
- ✅ Listar todos os pacientes
- ✅ Visualizar detalhes do paciente (com cálculo de idade e IMC)
- ✅ Editar dados do paciente
- ✅ Excluir paciente
- ✅ Interface HTML simples (sem CSS)
- ✅ Dados armazenados no Firebase Firestore

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **EJS** - Template engine
- **Body-Parser** - Parser de dados de formulário
- **Firebase Admin SDK** - Integração com Firebase
- **Firebase Firestore** - Banco de dados NoSQL

## 📦 Instalação

### 1. Instalar dependências
```powershell
npm install
```

### 2. Configuração do Firebase

#### Passo 2.1: Criar projeto no Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Criar um projeto"
3. Digite o nome do projeto (ex: "clinica-pacientes")
4. Configure o Google Analytics se desejar
5. Clique em "Criar projeto"

#### Passo 2.2: Habilitar Firestore
1. No painel do Firebase, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" 
4. Selecione a localização (ex: southamerica-east1)
5. Clique em "Concluído"

#### Passo 2.3: Gerar chave de acesso
1. Vá em "Configurações do projeto" (ícone de engrenagem no menu lateral esquerdo, ao lado de "Visão geral do projeto").
2. Clique na aba "Contas de serviço".
3. Clique no botão "Gerar nova chave privada" na seção "Chave privada do SDK Admin".
4. Confirme o download do arquivo JSON.
5. Renomeie o arquivo baixado para `serviceAccountKey.json` (se necessário).
6. Coloque o arquivo `serviceAccountKey.json` na **raiz do projeto** (mesmo nível do arquivo `app.js`).

> **Atenção:**
> - Nunca compartilhe ou faça upload do arquivo `serviceAccountKey.json` em repositórios públicos.
> - Este arquivo é essencial para a autenticação do backend com o Firebase.
> - Se perder a chave, gere uma nova pelo mesmo caminho no console do Firebase.

#### Passo 2.4: Configurar variáveis de ambiente
1. Crie um arquivo `.env` na raiz do projeto:
```
PORT=3000
FIREBASE_DATABASE_URL=https://SEU-PROJETO-firebase-default-rtdb.firebaseio.com/
```

2. Substitua `SEU-PROJETO` pelo ID do seu projeto Firebase

### 3. Executar aplicação

#### Modo desenvolvimento:
```powershell
npm run dev
```

#### Modo produção:
```powershell
npm start
```

### 4. Acessar aplicação
Abra o navegador em: `http://localhost:3000`

## 📊 Estrutura dos Dados

### Tabela Paciente (Firebase Firestore Collection: 'pacientes')
```javascript
{
  nome_pac: String,        // Nome do paciente
  data_nasc_pac: Timestamp, // Data de nascimento
  peso_pac: Number,        // Peso em kg
  alt_pac: Number,         // Altura em metros
  tipo_sang: String,       // Tipo sanguíneo (A+, A-, B+, B-, AB+, AB-, O+, O-)
  created_at: Timestamp,   // Data de criação
  updated_at: Timestamp    // Data de atualização
}
```

## 🚀 Rotas da Aplicação

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Lista todos os pacientes |
| GET | `/criar` | Formulário para criar paciente |
| POST | `/criar` | Criar novo paciente |
| GET | `/visualizar/:id` | Ver detalhes do paciente |
| GET | `/editar/:id` | Formulário para editar paciente |
| POST | `/editar/:id` | Atualizar dados do paciente |
| GET | `/deletar/:id` | Confirmação de exclusão |
| POST | `/deletar/:id` | Excluir paciente |

## 📁 Estrutura de Arquivos

```
crud-node-firebase-clinica/
├── views/
│   ├── index.ejs           # Lista de pacientes
│   ├── criar.ejs           # Formulário de criação
│   ├── editar.ejs          # Formulário de edição
│   ├── visualizar.ejs      # Detalhes do paciente
│   └── deletar.ejs         # Confirmação de exclusão
├── app.js                  # Arquivo principal
├── package.json            # Dependências
├── serviceAccountKey.json  # Chave do Firebase (não versionada)
├── .env                    # Variáveis de ambiente (não versionada)
└── README.md              # Este arquivo
```

## 🔧 Configurações Adicionais

### Regras de Segurança do Firestore
Para ambiente de desenvolvimento, use estas regras:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **IMPORTANTE**: Para produção, configure regras mais restritivas!

## 🎯 Funcionalidades Extras

- **Cálculo automático de idade** baseado na data de nascimento
- **Cálculo do IMC** (Índice de Massa Corporal) e classificação
- **Validação de dados** nos formulários
- **Confirmação dupla** para exclusão de pacientes
- **Navegação intuitiva** entre páginas

## 🐛 Solução de Problemas

### Erro: "Cannot find module './serviceAccountKey.json'"
- Certifique-se de ter baixado a chave do Firebase
- Verifique se o arquivo está na raiz do projeto
- Confirme se o nome está exato: `serviceAccountKey.json`

### Erro: "Firebase Admin SDK already initialized"
- Reinicie a aplicação
- Verifique se não há múltiplas inicializações do Firebase

### Erro de conexão com Firestore
- Verifique se o Firestore está habilitado no projeto
- Confirme se as regras de segurança permitem acesso
- Verifique a URL do projeto no arquivo `.env`

## 📝 Comandos Úteis

```powershell
# Instalar dependências
npm install

# Executar em modo desenvolvimento (com auto-reload)
npm run dev

# Executar em modo produção
npm start

# Verificar versão do Node.js
node --version

# Verificar versão do npm
npm --version
```

## 🚀 Deploy (Opcional)

Para colocar em produção, você pode usar:
- **Heroku**
- **Vercel** 
- **Google Cloud Platform**
- **Firebase Hosting** (para frontend) + **Cloud Functions** (para backend)

## 📄 Licença

Este projeto está sob a licença ISC.

---

**Desenvolvido em**: 24/06/2025  
**Tecnologias**: Node.js + Firebase + EJS  
**Objetivo**: Sistema CRUD de pacientes para clínica 

---

## 🧭 Orientação: Flexibilizando o sistema para outras plataformas

Para adaptar e ampliar o uso do sistema em diferentes plataformas (web, PWA, desktop), siga os tutoriais na ordem recomendada abaixo:

1. **[TUTORIAL-PWA.md](./TUTORIAL-PWA.md)**  
   Aprenda a transformar o sistema em um Progressive Web App (PWA), permitindo instalação no dispositivo, funcionamento offline e experiência de app nativo. Este é o primeiro passo para garantir flexibilidade e modernidade ao sistema.

2. **[TUTORIAL-DEPLOY-VERCEL.md](./TUTORIAL-DEPLOY-VERCEL.md)**  
   Veja como publicar o sistema na Vercel, tornando-o acessível via internet, com HTTPS e pronto para uso universal. Este é o método recomendado e prioritário para produção.

3. **[TUTORIAL-EMPACOTAR.md](./TUTORIAL-EMPACOTAR.md)**  
   Caso precise de uma versão desktop (executável para Windows), siga este tutorial. Lembre-se: o sistema foi otimizado para rodar na web, então utilize o empacotamento apenas em situações específicas.

> **Recomendação:** Sempre priorize o uso via PWA e Vercel para maior compatibilidade, segurança e facilidade de manutenção. O empacotamento desktop é opcional e só deve ser feito se realmente necessário.

--- 