# Blog Posts App


Um aplicativo móvel para compartilhamento de posts e interação entre usuários, desenvolvido com React Native e Expo.

## 🚀 Funcionalidades

- **Autenticação de Usuários**
  - Login e registro de usuários
  - Persistência de sessão

- **Posts**
  - Criação de posts com título e conteúdo
  - Visualização de posts locais e da API
  - Sistema de favoritos
  - Compartilhamento de posts

- **Comentários**
  - Adição de comentários em posts
  - Suporte para comentários com mídia (em desenvolvimento)

- **Busca e Filtros**
  - Busca em posts e favoritos
  - Filtro por título e conteúdo
  ```typescript:src/screens/Home.tsx
  startLine: 121
  endLine: 129
  ```

- **Perfil de Usuário**
  - Visualização de informações do usuário
  - Lista de posts do usuário
  ```typescript:src/screens/UserProfile.tsx
  startLine: 224
  endLine: 260
  ```

## 🛠 Tecnologias

- React Native
- Expo
- TypeScript
- Redux Toolkit (Gerenciamento de Estado)
- Styled Components
- React Navigation
- AsyncStorage (Persistência Local)
- Axios (Requisições HTTP)

## 💻 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go (para dispositivos físicos)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/RuanSerraAzul/blog-posts.git
cd blog-posts
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o projeto:
```bash
npm expo start
# ou
yarn expo start
```

## 📱 Executando o App

Após iniciar o projeto com Expo, você tem algumas opções:

- Pressione `a` para abrir no Android Emulator
- Pressione `i` para abrir no iOS Simulator
- Escaneie o QR Code com o app Expo Go no seu dispositivo físico


## 📦 Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── screens/       # Telas do aplicativo
  ├── navigation/    # Configuração de navegação
  ├── store/         # Configuração Redux e slices
  ├── services/      # Serviços e APIs
  ├── hooks/         # Custom hooks
  ├── types/         # Definições de tipos TypeScript
  └── theme/         # Configuração de tema
```

