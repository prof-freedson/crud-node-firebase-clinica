# Como transformar seu sistema em um PWA (Progressive Web App)

Este tutorial ensina, passo a passo, como transformar seu sistema Node.js/Express em um PWA (Progressive Web App). Um PWA permite que seu sistema seja instalado como um aplicativo no dispositivo do usuário, funcione offline e ofereça uma experiência mais próxima de um app nativo.

---

## 1. O que é necessário para um PWA?

Para transformar seu sistema em um PWA, você precisa de:
- Um arquivo `manifest.json` (define como o app será exibido/instalado)
- Um arquivo `service-worker.js` (responsável pelo funcionamento offline e cache)
- Referências ao manifest e registro do service worker no HTML principal
- Servir tudo via HTTPS em produção

---

## 2. Criando o arquivo `manifest.json`

O `manifest.json` descreve o aplicativo para o navegador: nome, ícone, cor, tela inicial, etc. Ele deve ficar na pasta `public`.

**Exemplo de `public/manifest.json`:**

```json
{
  "name": "Nome da Clínica",
  "short_name": "Clínica",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "description": "Sistema de gestão de clínica",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

> **Atenção:**
> - Crie a pasta `public/icons` e adicione ícones nos tamanhos 192x192 e 512x512.
> - O campo `start_url` define a tela inicial ao abrir o app.
> - `display: standalone` faz o app parecer nativo, sem barra de endereço.

---

## 3. Criando o arquivo `service-worker.js`

O service worker é um script que roda em segundo plano, permitindo cache offline, notificações push, etc. Ele também deve ficar em `public`.

**Exemplo de `public/service-worker.js` com comentários:**

```js
// Evento de instalação do service worker
self.addEventListener('install', function(event) {
  // Faz o SW assumir o controle imediatamente
  self.skipWaiting();
});

// Evento de ativação do service worker
self.addEventListener('activate', function(event) {
  // Aqui você pode limpar caches antigos, se necessário
});

// Intercepta requisições e tenta servir do cache primeiro
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Se encontrar no cache, retorna; senão, busca na rede
      return response || fetch(event.request);
    })
  );
});
```

> **Dica:** Este é um exemplo simples. Para produção, implemente estratégias de cache mais avançadas conforme sua necessidade.

---

## 4. Referenciando o manifest e registrando o service worker

No arquivo EJS principal (por exemplo, `views/index.ejs`), adicione dentro da tag `<head>`:

```html
<!-- Referência ao manifest.json -->
<link rel="manifest" href="/manifest.json">
<!-- Cor da barra do navegador no mobile -->
<meta name="theme-color" content="#1976d2">
```

> **No seu projeto, o arquivo principal é `views/index.ejs`. Faça as alterações nele.**

Antes do fechamento da tag `</body>`, adicione o script para registrar o service worker:

```html
<script>
  // Verifica se o navegador suporta service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(reg) {
        console.log('Service Worker registrado!', reg);
      })
      .catch(function(err) {
        console.log('Erro ao registrar o Service Worker:', err);
      });
  }
</script>
```

---

## 5. Servindo arquivos estáticos

O Express deve estar configurado para servir a pasta `public` como estática. No seu arquivo `app.js`, garanta que existe a linha:

```js
app.use(express.static(path.join(__dirname, "public")));
```

Assim, o manifest e o service worker serão servidos corretamente.

---

## 6. HTTPS é obrigatório em produção

PWAs só funcionam com service worker em HTTPS (exceto em localhost para testes). Ao publicar, garanta que seu servidor utilize HTTPS.

---

## 7. Testando seu PWA

1. Acesse o sistema pelo navegador (de preferência Google Chrome).
2. Abra as DevTools (F12) e vá em "Lighthouse" ou "Aplicativo" para testar a instalação e funcionamento do PWA.
3. Verifique se aparece a opção "Instalar" no navegador.
4. Teste o funcionamento offline (desconecte a internet e veja se o app carrega o que foi cacheado).

---

## 8. Dicas finais e boas práticas

- Personalize o manifest.json com nome, cores e ícones do seu sistema.
- Implemente estratégias de cache inteligentes no service worker para garantir que dados sensíveis não fiquem desatualizados.
- Sempre teste em diferentes navegadores e dispositivos.
- Consulte a documentação oficial do [Google PWA](https://web.dev/progressive-web-apps/) para recursos avançados.

---

**Observação:**
Este projeto utiliza Firebase como backend, portanto não é necessário configurar MySQL ou PlanetScale. Ignore a seção de banco de dados se estiver usando Firebase.

