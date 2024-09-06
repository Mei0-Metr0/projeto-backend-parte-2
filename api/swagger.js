import swaggerAutogen from 'swagger-autogen';

const swaggerAutogenInstance = swaggerAutogen();

const output = './swagger_doc.json'; // Caminho do arquivo de saída para a documentação gerada
const endpoints = ['./index.js']; // Caminho do arquivo que contém as rotas da API

// Definindo a documentação básica do Swagger
const doc = {
    info: {
      version: '1.0.0', // Versão da API
      title: 'Adoption REST', // Título da API
      description: 'API REST para gerenciamento de adoções de pets', // Descrição da API
    },
};

// Gera automaticamente o arquivo de saída com as especificações do Swagger
swaggerAutogenInstance(output, endpoints, doc);
