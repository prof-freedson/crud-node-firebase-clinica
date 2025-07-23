# Como Transformar o Sistema em Executável e Instalador (Windows)

Este tutorial ensina como empacotar seu sistema Node.js + Firebase em um executável (.exe) usando Electron e criar um instalador (.exe) para Windows, facilitando a distribuição e instalação em outros computadores.

---

## 1. Gerar Executável com Electron

O [Electron](https://www.electronjs.org/) permite criar aplicações desktop usando Node.js e Chromium, empacotando tudo em um executável.

### Passo 1: Instalar o Electron e o Electron Packager
Abra o PowerShell na raiz do projeto e execute:
```powershell
npm install --save-dev electron electron-packager
```

### Passo 2: Criar o arquivo principal do Electron
Crie um arquivo chamado `main.js` na raiz do projeto com o seguinte conteúdo básico:
```js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  // Inicia o servidor Node.js
  require('./app');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```
> **Dica:** Certifique-se de que o seu `app.js` (servidor) está configurado para não travar se for iniciado mais de uma vez.

### Passo 3: Ajustar o `package.json`
Adicione ou ajuste os campos:
```json
// ...
"main": "main.js",
"scripts": {
  "start": "electron .",
  "pack": "electron-packager . crud-clinica --platform=win32 --arch=x64 --out=dist --overwrite"
},
// ...
```

### Passo 4: Empacotar a aplicação
Execute:
```powershell
npm run pack
```
- Isso irá gerar uma pasta `dist/crud-clinica-win32-x64` com o executável do sistema.

> **Atenção:**
> - O arquivo `serviceAccountKey.json`, a pasta `views/`, a pasta `public/` e o arquivo `.env` devem estar juntos do executável, pois são lidos em tempo de execução.

### Passo 5: Testar o executável
No PowerShell, execute:
```powershell
./dist/crud-clinica-win32-x64/crud-clinica.exe
```
A aplicação abrirá em uma janela desktop.

---

## 2. Criar Instalador com Inno Setup

O [Inno Setup](https://jrsoftware.org/isinfo.php) é uma ferramenta gratuita para criar instaladores Windows.

### Passo 1: Baixar e instalar o Inno Setup
- Acesse: https://jrsoftware.org/isdl.php
- Baixe e instale o Inno Setup.

### Passo 2: Preparar os arquivos para o instalador
Crie uma pasta, por exemplo `dist/instalador/`, e coloque dentro:
- Pasta `crud-clinica-win32-x64` (gerada pelo Electron Packager)
- Pasta `views/`
- Pasta `public/`
- `serviceAccountKey.json`
- `.env`

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

## 3. Observações Importantes
- O executável depende dos arquivos de configuração e das views. Sempre distribua juntos.
- O Firebase requer a chave e o `.env`.
- Teste o instalador em outro computador antes de distribuir.

---

## 4. Referências
- [Documentação do Electron](https://www.electronjs.org/docs/latest/)
- [Electron Packager](https://github.com/electron/electron-packager)
- [Inno Setup](https://jrsoftware.org/isinfo.php)

---
