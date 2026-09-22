# 🔴 Kanto Pokédex

Uma Pokédex interativa inspirada nos jogos clássicos de Pokémon, desenvolvida com **HTML, CSS e JavaScript** e integrada à **PokéAPI**.

O projeto reúne os **151 Pokémon da região de Kanto** e funciona como uma Pokédex companion para jogadores de **Pokémon FireRed e LeafGreen**, permitindo consultar informações, acompanhar Pokémon capturados e visualizar o progresso até completar toda a Pokédex.

---

## 🎮 Sobre o projeto

A Kanto Pokédex foi desenvolvida para unir o consumo de uma **API REST** com uma interface inspirada nos jogos clássicos da franquia.

Além de consultar os Pokémon, o usuário pode utilizar a aplicação durante sua jornada para registrar quais Pokémon já capturou, descobrir quais ainda estão faltando e acompanhar seu progresso até chegar aos **151/151**.

Ao completar a Pokédex, o treinador desbloqueia um **certificado de conclusão da região de Kanto**. 🏆

---

## ✨ Funcionalidades

- 🔴 Todos os **151 Pokémon de Kanto**
- 🔎 Busca por **nome ou número da Pokédex**
- 🎯 Filtros:
  - All
  - Caught
  - Missing
- ✅ Marcação de Pokémon capturados
- 💾 Progresso salvo utilizando **LocalStorage**
- 📊 Contador de progresso `X / 151`
- 📈 Barra e porcentagem de conclusão
- ⚡ Opção de **Select All** e **Clear All**
- 📖 Modal individual para cada Pokémon
- ❤️ Base Stats
- 📏 Altura e peso
- 🧬 Tipos
- ⚙️ Habilidades
- 📍 Localizações em **FireRed / LeafGreen**
- 🎒 Informações de **How to Obtain**
- ⬆️ Informações de evolução
- 🎁 Métodos especiais de obtenção
- ⬅️➡️ Navegação entre Pokémon pelo modal
- 🎞️ Animações nos sprites
- 🌄 Background animado inspirado em Kanto
- ⏳ Tela de carregamento da Pokédex
- 🏆 Certificado ao completar **151 / 151**

---

## 🏆 Pokédex Completion Certificate

Ao registrar todos os Pokémon:

```text
151 / 151
100%
```

a aplicação reconhece a conclusão da Pokédex e desbloqueia um **certificado de conclusão de Kanto**.

O certificado pode ser visualizado novamente depois de desbloqueado.

---

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- REST API
- Fetch API
- LocalStorage
- PokéAPI
- Git
- GitHub

---

## 🌐 API

Os dados dos Pokémon são obtidos através da **PokéAPI**.

A aplicação utiliza diferentes endpoints para obter informações como:

- Pokémon
- Tipos
- Sprites
- Stats
- Habilidades
- Espécies
- Cadeias evolutivas
- Encontros e localizações

---

## 📁 Estrutura do projeto

```text
kanto-pokedex/
│
├── assets/
│   ├── css/
│   │   ├── global.css
│   │   └── pokedex.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── poke-api.js
│   │   └── pokemon-model.js
│   │
│   └── videos/
│       └── kanto-background.mp4
│
├── index.html
└── README.md
```

---

## 🚀 Como executar

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd kanto-pokedex
```

Abra o projeto utilizando um servidor local.

Uma opção é utilizar a extensão **Live Server** no Visual Studio Code e executar o `index.html`.

> A aplicação necessita de conexão com a internet para consultar os dados da PokéAPI.

---

## 💾 Salvamento do progresso

O progresso da Pokédex é armazenado utilizando o **LocalStorage do navegador**.

Isso permite manter informações como:

```text
Pokémon capturados
Progresso da Pokédex
Certificado desbloqueado
Nome do treinador
```

sem necessidade de conta ou banco de dados.

Os dados são armazenados localmente no navegador utilizado.

---

## 🎯 Objetivo

Este projeto foi desenvolvido com foco na prática e evolução de conhecimentos em desenvolvimento web, principalmente:

- Manipulação do DOM
- Consumo de APIs REST
- JavaScript assíncrono
- Promises
- Async/Await
- Fetch API
- Manipulação de arrays
- Eventos
- LocalStorage
- Responsividade
- Animações com CSS
- Organização e separação de responsabilidades no JavaScript

---

## 🔮 Possíveis evoluções

Algumas funcionalidades que podem ser adicionadas futuramente:

- Sistema de contas
- Sincronização do progresso entre dispositivos
- Pokédex de outras regiões
- Mapa interativo de Kanto
- Informações adicionais sobre movimentos
- Comparação entre Pokémon
- Tema alternativo
- Deploy como PWA

---

## 👨‍💻 Autor

**Pedro Henrique Faber**

Desenvolvedor de Software | Full Stack

---

## 📜 Aviso

Pokémon e seus respectivos nomes, personagens e elementos pertencem aos seus respectivos proprietários.

Este é um projeto desenvolvido para fins educacionais e de portfólio.