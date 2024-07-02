import express from "express"
import cors from "cors"
import dotenv from 'dotenv';

import loginRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

import connectDatabase from './db/conn.js';

dotenv.config();

const app = express()
app.use(cors())

// Config JSON response
app.use(express.json())

// Rotas
app.use(userRoutes);
app.use(loginRoutes);

// DB Connection
connectDatabase().catch(err => {
    console.error('Erro ao iniciar o aplicativo:', err.message);
    process.exit(1);
});

const port = process.env.PORT

app.listen(port, function() {
    console.log(`Servidor rodando na porta ${port}`);
})

