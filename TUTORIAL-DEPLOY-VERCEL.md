# Tutorial: Publicando o Sistema CRUD de Pacientes na Vercel

> **ATENÇÃO:** A partir de agora, o método recomendado e prioritário para usar o sistema é via deploy na Vercel. O uso de executáveis locais (Electron) e servidor local foi descontinuado. Siga este tutorial para garantir acesso universal e manutenção facilitada.

## Visão Geral
Este tutorial ensina como adaptar e publicar seu sistema Node.js + Firebase (com EJS e PWA) na Vercel, tornando-o acessível via internet, sem depender de servidor local ou executável desktop.

---

## 1. Ajustes necessários no projeto

### a) Remover dependências do Electron
- Exclua arquivos e referências ao Electron (`main.js`, scripts do Electron no `package.json`).
- O deploy na Vercel é web, não desktop.

### b) Certifique-se que o backend (Express) serve tudo:
- O Express já serve arquivos estáticos da pasta `public` e renderiza as views EJS.
- Não é necessário separar frontend e backend, pois o Express já faz ambos.

### c) Garanta que as variáveis de ambiente estão no `.env`:
```env
PORT=3000
FIREBASE_DATABASE_URL=https://SEU-PROJETO-firebaseio.com/
```
- **Nunca** suba o arquivo `serviceAccountKey.json` para repositórios públicos.

---

## 2. Subindo o projeto para o GitHub

1. Crie um repositório no GitHub.
2. Suba todos os arquivos do projeto, exceto o `.env` e `serviceAccountKey.json` (adicione ao `.gitignore`).
3. No README, explique que esses arquivos devem ser configurados nas variáveis de ambiente da Vercel.

---

## 3. Configurando o deploy na Vercel

### a) Crie uma conta em [vercel.com](https://vercel.com)

### b) Importe seu repositório do GitHub

### c) Configure as variáveis de ambiente na Vercel:
- No painel do projeto, vá em **Settings > Environment Variables**.
- Adicione:
  - `FIREBASE_DATABASE_URL` com o valor do seu projeto Firebase.
  - Para a chave do Firebase, crie uma variável chamada `SERVICE_ACCOUNT_KEY` e cole o conteúdo do seu `serviceAccountKey.json` como uma string JSON (ou use o recurso de arquivos secretos da Vercel).

### d) Ajuste o código para ler a chave do Firebase das variáveis de ambiente:
No `app.js`, troque:
```js
const serviceAccount = require('./serviceAccountKey.json');
```
por:
```js
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
```
Assim, a chave será lida da variável de ambiente.

### e) Ajuste o `package.json`:
- Troque o script de start para:
```json
"start": "node app.js"
```
- Remova scripts do Electron.

### f) Confirme que o `app.js` exporta o app para o Vercel:
No final do `app.js`, troque:
```js
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```
por:
```js
module.exports = app;
```
A Vercel cuida de rodar o servidor.

### g) Crie um arquivo `vercel.json` (opcional, mas recomendado):
```json
{
  "version": 2,
  "builds": [
    { "src": "app.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "app.js" }
  ]
}
```

---

## 4. Deploy

- Clique em "Deploy" na Vercel.
- Aguarde a publicação.
- O sistema estará disponível em `https://seu-projeto.vercel.app`.

---

## 5. Acesso universal

- Agora, qualquer pessoa pode acessar o sistema via navegador, inclusive instalar como PWA.
- Não é mais necessário rodar servidor local ou usar executável.

---

## 6. Observações finais

- O sistema continuará funcionando como PWA, inclusive offline (conforme o service worker).
- O backend Express e as views EJS são servidas normalmente pela Vercel.
- Para segurança, nunca exponha a chave do Firebase em repositórios públicos.

---

## 7. Sobre versões desktop/executável

- O uso de executáveis locais (Electron) e servidor Node.js local **não é mais recomendado**.
- O sistema foi otimizado para rodar 100% na web, via Vercel.
- Caso ainda precise de um instalador desktop, consulte o tutorial de empacotamento, mas **dê sempre preferência ao uso via Vercel**.


