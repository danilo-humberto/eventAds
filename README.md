# EventADS

Aplicativo mobile para divulgação e gerenciamento de eventos acadêmicos, desenvolvido com React Native e Expo. O projeto permite autenticar usuários, cadastrar eventos, listar eventos, visualizar detalhes, editar e excluir registros, fazer upload de imagens e manter um histórico local de notificações.

## Funcionalidades

- Splash screen de abertura.
- Login com Firebase Authentication.
- Cadastro de novos usuários.
- Recuperação de senha por e-mail.
- Logout.
- Listagem de eventos cadastrados.
- Busca de eventos por título ou local.
- Cadastro de eventos.
- Edição de eventos.
- Exclusão de eventos.
- Tela de detalhes do evento.
- Upload de imagens para Cloudinary.
- Perfil do usuário.
- Edição de perfil com nome e foto.
- E-mail exibido como informação somente leitura no perfil.
- Controle para apenas o criador editar ou excluir seus eventos.
- Histórico local de notificações usando AsyncStorage.
- Navegação por Stack Navigator e Bottom Tabs.

## Tecnologias

### Frontend

- React Native
- Expo
- Firebase Authentication
- Axios
- React Navigation
- Expo Image Picker
- Expo Notifications
- AsyncStorage
- Lucide React Native

### Backend

- JSON Server
- Express
- Cloudinary
- CORS
- Body Parser

## Estrutura do Projeto

```text
eventAds/
  backend/
    db.json
    package.json
    server.js

  frontend/
    App.js
    app.json
    package.json
    src/
      helpers/
      screens/
      services/
      styles/
```

## Pré-requisitos

- Node.js instalado.
- npm instalado.
- Expo CLI ou uso via `npx expo`.
- Android Studio configurado, caso queira rodar ou gerar build local Android.
- Celular Android/emulador conectado.
- Conta Firebase configurada.
- Conta Cloudinary com upload preset configurado.

## Instalação

Instale as dependências do backend:

```bash
cd backend
npm install
```

Instale as dependências do frontend:

```bash
cd frontend
npm install
```

## Configuração da API

O frontend acessa o backend pelo arquivo:

```text
frontend/src/services/api.js
```

Atualmente a base da API está configurada assim:

```js
baseURL: "http://192.168.3.6:3000";
```

Para testar em um celular físico, o computador e o celular precisam estar na mesma rede Wi-Fi. Se o IP da máquina mudar, atualize esse valor para o IP atual do computador.

Exemplo:

```js
baseURL: "http://SEU_IP_LOCAL:3000";
```

No emulador Android, pode ser necessário usar:

```js
baseURL: "http://10.0.2.2:3000";
```

## Executando o Backend

Na pasta `backend`, execute o JSON Server:

```bash
npm run server
```

Esse comando sobe a API fake em:

```text
http://localhost:3000
```

Principais recursos usados pelo app:

```text
GET    /users
POST   /users
PATCH  /users/:id

GET    /events
POST   /events
PUT    /events/:id
DELETE /events/:id
```

## Servidor Cloudinary Opcional

O arquivo `backend/server.js` sobe um servidor Express na porta `3001` com rotas auxiliares para listar e deletar imagens no Cloudinary:

```bash
cd backend
npm run dev
```

Rotas disponíveis:

```text
GET    /images
DELETE /delete-image
```

O upload usado no app é feito diretamente para a API do Cloudinary pelo arquivo:

```text
frontend/src/services/cloudinaryConfig.js
```

## Executando o App

Com o backend rodando, abra outro terminal e execute:

```bash
cd frontend
npm start
```

O script atual usa:

```bash
expo start --dev-client
```

Para instalar/rodar no Android via Expo:

```bash
npm run android
```

Também é possível abrir no navegador para testes simples:

```bash
npm run web
```

## Autenticação

A autenticação usa Firebase Authentication:

```text
frontend/src/services/firebaseConfig.js
```

Fluxos implementados:

- Login com e-mail e senha.
- Cadastro com e-mail e senha.
- Recuperação de senha por e-mail.
- Logout.

Os dados complementares do usuário, como nome e foto, são salvos no `json-server` em `/users`.

## Eventos

Os eventos são persistidos no `json-server` em `/events`.

Campos principais:

```text
titulo
descricao
data
hora
local
imagem
userId
createdAt
```

Somente o usuário criador do evento consegue visualizar as ações de editar e excluir no app.

## Imagens

O app usa `expo-image-picker` para escolher imagens da galeria e Cloudinary para armazenar os arquivos.

As imagens são usadas em:

- foto do usuário;
- foto do perfil;
- imagem do evento.

## Notificações e Persistência Local

O projeto usa AsyncStorage para manter um histórico local de notificações:

```text
frontend/src/services/notificationStorage.js
```

Quando um novo evento é cadastrado, o app salva um aviso local. A tela de notificações carrega esses avisos do armazenamento local e permite:

- listar notificações;
- apagar uma notificação;
- limpar todas as notificações.

Observação: a dependência `expo-notifications` já está instalada, mas a notificação local do sistema operacional ainda precisa ser ativada com `scheduleNotificationAsync` caso seja necessário exibir o alerta nativo do Android/iOS.

## Build Android

### Opção 1: Build Local Debug

Com Android Studio e SDK configurados, execute:

```bash
cd frontend/android
./gradlew assembleDebug
```

No Windows PowerShell:

```powershell
cd frontend\android
.\gradlew.bat assembleDebug
```

O APK debug geralmente será gerado em:

```text
frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

### Opção 2: Build com EAS

Caso prefira gerar uma build pela infraestrutura da Expo:

```bash
cd frontend
npx eas build:configure
npx eas build -p android
```

Se quiser gerar APK em vez de AAB, configure um perfil adequado no `eas.json`.

## Checklist de Validação Manual

Antes da entrega, valide estes fluxos no app:

- Abrir o app e visualizar a splash screen.
- Criar uma nova conta.
- Fazer login.
- Recuperar senha pela tela de esqueci minha senha.
- Cadastrar evento com título, descrição, data, hora, local e imagem.
- Ver o evento na listagem.
- Buscar evento por título ou local.
- Abrir detalhes do evento.
- Editar evento criado pelo usuário logado.
- Excluir evento criado pelo usuário logado.
- Confirmar que evento de outro usuário não mostra botões de editar/excluir.
- Conferir se a notificação aparece na aba Notificações após cadastrar evento.
- Apagar uma notificação.
- Limpar todas as notificações.
- Editar nome/foto do perfil.
- Confirmar que o e-mail do perfil aparece como somente leitura.
- Sair da conta.
- Gerar e instalar uma build Android.

## Pontos de Atenção Antes da Entrega

- O app ainda está nomeado como `frontend` em `frontend/app.json`; para entrega, recomenda-se alterar para `EventADS`.
- A API está com IP local fixo em `frontend/src/services/api.js`.
- O backend com `json-server` não possui autorização real; o controle de edição/exclusão foi implementado no app.
- O arquivo `backend/server.js` possui credenciais Cloudinary hardcoded. Antes de publicar no GitHub, mova esses dados para variáveis de ambiente.
- Não há testes automatizados configurados no projeto.
- Não há workflow de CI/CD configurado.
- Não há `eas.json` configurado para build Android pela Expo.
- A notificação nativa do sistema via `expo-notifications` ainda precisa ser implementada se o professor exigir o alerta do Android/iOS, não apenas o histórico local no app.

## Entrega Recomendada

Para a entrega da atividade, incluir:

- link do repositório GitHub;
- capturas de tela do app funcionando;
- vídeo demonstrando os fluxos principais;
- APK ou link da build Android;
- instruções atualizadas de execução no README.
