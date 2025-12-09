# Projeto de Exemplo: Cliente-Servidor

Este projeto consiste em um servidor de back-end simples e um aplicativo de front-end para interagir com ele.

## Visão Geral

-   **Servidor:** Uma API Node.js/Express que expõe endpoints para acessar dados de arquivos JSON.
-   **Cliente:** Um aplicativo Next.js que consome a API do servidor e exibe os dados.

## Estrutura do Projeto

testTarget/
├── servidor/      # Contém a aplicação do servidor back-end
│   ├── dados/       # Arquivos JSON servidos pela API
│   ├── db/          # Lógica de "banco de dados" para ler os arquivos
│   └── index.js     # Arquivo principal do servidor Express
└── test/          # Contém a aplicação do cliente front-end
    ├── app/         # Código-fonte do aplicativo Next.js
    └── ...

## Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18.x ou superior)
-   [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)

## Instalação

Você precisará instalar as dependências para o servidor e o cliente separadamente.

**1. Instalar dependências do servidor:**

```bash
cd servidor
npm install
```

**2. Instalar dependências do cliente:**

```bash
cd ../test
npm install
```

## Como Executar

**1. Iniciar o Servidor:**

Navegue até a pasta do servidor e inicie o servidor (geralmente na porta 3001).

```bash
cd servidor
node index.js
```

**2. Iniciar o Cliente:**

Em um **novo terminal**, navegue até a pasta do cliente e inicie o aplicativo de desenvolvimento Next.js.

```bash
cd test
npm run dev
```

Após iniciar o cliente, você pode abrir seu navegador e acessar `http://localhost:3000` para ver a aplicação em execução. As páginas "teste1" e "teste2" buscarão dados do servidor.



No teste 2 escolhi optar por um banco de dados invez da propria api em si, entao usei o azure, para melhor visualizacao, crie seu banco de dados, depois de feita a conexao, so consumir api, para mais duvidas entrar em contato, tudo 100% funcional


DBA SCHEMA

CREATE TABLE Estoque (
    codigoProduto INT IDENTITY(1,1) PRIMARY KEY,
    descricaoProduto VARCHAR(100) NOT NULL,
    estoque INT NOT NULL
);


CREATE TABLE Transacoes (
    id_transacao INT IDENTITY(1,1) PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    data_transacao DATETIME NOT NULL DEFAULT GETDATE(),
    quantidade INT NOT NULL,
    id_estoque INT NOT NULL,
    FOREIGN KEY (id_estoque) REFERENCES Estoque(codigoProduto)

);


INSERT INTO Estoque (codigoProduto, descricaoProduto, estoque) VALUES
(101,'Caneta Azul', 150),
(102,'Caderno Universitário', 75),
(103,'Borracha Branca', 200),
(104,'Lápis Preto HB', 320),
(105,'Marcador de Texto Amarelo', 90);

SET IDENTITY_INSERT Estoque ON;
set IDENTITY_INSERT Estoque OFF;





