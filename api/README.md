<div align="center">

![image_info](https://img.shields.io/badge/Nome-Joice_Kelly_Oliveira_Mendes-pink)
![image_info](https://img.shields.io/badge/RA-2348020-red)
![image_info](https://img.shields.io/badge/Professor-Adriano_Rivolli-blue)
[![Badge ServeRest](https://img.shields.io/badge/Tema-Adoção_de_Pets-green)](https://github.com/ServeRest/ServeRest/)

<img src="./assets/imagem.jpeg" width="300" height="300">

</div>

## 💬 Sobre

Este é a entrega do projeto 2 da disciplina de BackEnd para construção de uma API REST com conexão ao Bando de Dados.

## Estrutura de pastas

```bash
.
├── API/
│   ├── controllers/
│   │   ├── adoptionController.js
│   │   ├── installController.js
│   │   ├── loginController.js
│   │   ├── petController.js
│   │   └── userController.js
│   ├── db/
│   │   └── conn.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Adoption.js
│   │   ├── Pet.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adoptionRoutes.js
│   │   ├── authRoutes.js
│   │   ├── installRoute.js
│   │   ├── petRoutes.js
│   │   ├── swaggerRoute.js
│   │   └── userRoutes.js
│   ├── uploads/
│   └── validators/
│       ├── loginValidator.js
│       └── userValidator.js
├── .env.example
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
├── README.md
├── swagger_doc.json
└── swagger.js
```

#### API/
<p>Pasta principal contendo todo o código do backend.</p>

#### controllers/
<p>Contém a lógica de negócios da aplicação, gerenciando operações relacionadas a adoções, instalação, login, pets e usuários.</p>

#### db/
<p>Arquivos relacionados à configuração e conexão com o banco de dados.</p>

#### middlewares/
<p>Funções de middleware para processamento de requisições, incluindo autenticação e upload de arquivos.</p>

#### models/
<p>Define os modelos de dados da aplicação, como Adoção, Pet e Usuário.</p>

#### routes/
<p>Define as rotas da API para diferentes funcionalidades do sistema.</p>

#### uploads/
<p>Pasta para o armazenamento das imagens enviadas no cadastro dos pets.</p>

#### validators/
<p>Contém lógica para validação de dados de entrada, como informações de login e dados de usuário.</p>

#### Arquivos na Raiz
Inclui arquivos de configuração do projeto, como variáveis de ambiente, gerenciamento de dependências, documentação da API (Swagger) e o ponto de entrada da aplicação (`index.js`).

## Tecnologias Utilizadas
- Framework: Express.
- Banco de dados: Atlas MongoDB, conexão utilizando o Mongoose.
- Testes: Postman.
- BackEnd: Node.js.

## Como Executar Localmente
1. Clone este repositório - `git clone [repository URL]`.
2. Navegue para o diretório do projeto - `cd [project name]`.
3. Instale as dependências com `npm install`.
4. Copie as variáveis de .env.example para .env - `cp .env.example .env`.
4. Configure as variáveis de ambiente (consulte `.env.example`). 
5. Inicie o servidor com `npm start`.
6. Acesse `http://localhost:3000` no seu navegador.

## Gerar a documentação
Para atualizações na documentação com o Swagger:
1. Realize a alteração;
2. Rode o comando npm run swagger-autogen
3. Reinicia o servidor
4. Acesse `http://localhost:3000/docs`
