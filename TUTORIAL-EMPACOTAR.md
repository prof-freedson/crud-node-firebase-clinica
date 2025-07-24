# Como Transformar o Sistema em Executável e Instalador (Windows)

> **ATENÇÃO:** O método recomendado e prioritário para usar o sistema é via deploy na Vercel (veja o tutorial principal). O empacotamento desktop (Electron) só deve ser utilizado em casos muito específicos, pois o sistema foi otimizado para rodar 100% na web.

Este tutorial ensina como empacotar seu sistema Node.js + Firebase em um executável (.exe) usando Electron e criar um instalador (.exe) para Windows.

**⚠️ IMPORTANTE:** O executável desktop agora apenas abre uma janela apontando para a versão web hospedada na Vercel (ex: `https://seu-projeto.vercel.app`). Não é mais necessário rodar servidor local ou manter arquivos sensíveis no computador do usuário.

---

## 1. Gerar Executável com Electron

O [Electron](https://www.electronjs.org/) permite criar aplicações desktop usando Node.js e Chromium, empacotando tudo em um executável.

### Passo 1: Instalar o Electron e o Electron Packager
Abra o PowerShell na raiz do projeto e execute:
```powershell
npm install --save-dev electron electron-packager
```

### Passo 2: Criar o arquivo principal do Electron
Crie um arquivo chamado `main.js` na raiz do projeto com o seguinte conteúdo:
```js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'public', 'icons', 'icon-512.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  // Abra diretamente a URL da Vercel
  win.loadURL('https://seu-projeto.vercel.app');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```

> **Nota:** Não é mais necessário verificar porta, rodar servidor local ou incluir arquivos sensíveis no instalador.

### Passo 3: Ajustar o `package.json`
Adicione ou ajuste os campos:
```json
// ...
"main": "main.js",
"scripts": {
  "start": "electron .",
  "pack": "electron-packager . crud-clinica --platform=win32 --arch=x64 --out=dist --overwrite --icon=public/icons/icon-512.ico"
},
// ...
```

### Passo 4: Empacotar a aplicação
Execute:
```powershell
npm run pack
```
- Isso irá gerar uma pasta `dist/crud-clinica-win32-x64` com o executável do sistema.

### Passo 5: Testar o executável
Abra o executável gerado. Ele abrirá a versão web do sistema hospedada na Vercel.

---

## 2. Criar Instalador com Inno Setup

O [Inno Setup](https://jrsoftware.org/isinfo.php) é uma ferramenta gratuita para criar instaladores Windows.

### Passo 1: Baixar e instalar o Inno Setup
- Acesse: https://jrsoftware.org/isdl.php
- Baixe e instale o Inno Setup.

### Passo 2: Preparar os arquivos para o instalador
Crie uma pasta, por exemplo `dist/instalador/`, e coloque dentro:
- Pasta `crud-clinica-win32-x64` (gerada pelo Electron Packager)
- Pasta `public/` (opcional, apenas para ícones)

> **Não inclua** arquivos como `serviceAccountKey.json`, `.env`, `views/` ou o backend. Tudo está hospedado na Vercel.

### Passo 3: Criar o script do instalador
Exemplo de script (`instalador.iss`):
```iss
[Setup]
AppName=CRUD Clínica Pacientes
AppVersion=1.0
DefaultDirName={pf}\CRUDClinica
DefaultGroupName=CRUD Clínica
OutputDir=.
OutputBaseFilename=Instalador-CRUD-Clinica
SetupIconFile=public\icons\icon-512.ico
DefaultLanguage=pt_BR

[Files]
Source: "dist/instalador/*"; DestDir: "{app}"; Flags: recursesubdirs

[Icons]
Name: "{group}\CRUD Clínica"; Filename: "{app}\crud-clinica-win32-x64\crud-clinica.exe"
```

### Passo 4: Compilar o instalador
- Abra o Inno Setup.
- Carregue o script `instalador.iss`.
- Clique em "Compile".
- O instalador será gerado na pasta configurada (ex: `Instalador-CRUD-Clinica.exe`).

---

## 3. Como Usar o Sistema Instalado

- Basta abrir o executável instalado. Ele abrirá a versão web do sistema hospedada na Vercel.
- Não é necessário rodar servidor local, nem configurar variáveis de ambiente ou arquivos sensíveis.
- O sistema funcionará normalmente, inclusive como PWA, se instalado pelo navegador.

---

## 4. Solução de Problemas

### O sistema não carrega ou aparece "Página não encontrada"
- Verifique se a URL da Vercel está correta no arquivo `main.js`.
- Certifique-se de que o deploy na Vercel está ativo e funcionando.

### Ícone do Electron aparece no app ou no instalador
- Certifique-se de que o parâmetro `icon` no `main.js` e a flag `--icon` no comando de empacotamento apontam para um arquivo `.ico` válido
- No script do instalador, confira se `SetupIconFile` está correto

---

## 5. Referências
- [Tutorial de Deploy na Vercel (prioritário)](./TUTORIAL-DEPLOY-VERCEL.md)
- [Documentação do Electron](https://www.electronjs.org/docs/latest/)
- [Electron Packager](https://github.com/electron/electron-packager)
- [Inno Setup](https://jrsoftware.org/isinfo.php)
