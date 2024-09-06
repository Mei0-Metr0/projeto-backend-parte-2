import express from 'express'

// Swagger
import swaggerUI from 'swagger-ui-express';
import swaggerFile from '../swagger_doc.json' assert { type: 'json' };

const router = express.Router();

/*
    swaggerUI.serve: Middleware que serve os arquivos estáticos necessários para o Swagger UI funcionar;
    swaggerUI.setup(swaggerFile): Configura a interface do Swagger UI com base no arquivo JSON swaggerFile que contém a documentação da API.
*/
router.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

export default router;