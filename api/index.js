import express from "express"
import cors from "cors"
import dotenv from 'dotenv';

import loginRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import petRoutes from './routes/petRoutes.js'
import adoptionRoutes from './routes/adoptionRoutes.js'
import installRoute from './routes/installRoute.js';
import docs from './routes/swaggerRoute.js';

import connectDatabase from './db/conn.js'

/*
    mongoose: Uma biblioteca ODM (Object Data Modeling);
    bcrypt: Uma biblioteca usada para hashing de senhas.
    
    JWT é um padrão que define um token de segurança que é auto-contido, ou seja, contém todas as informações 
    necessárias (claims) para identificar o usuário ou garantir a segurança da comunicação, sem a necessidade 
    de manter estado no servidor.
*/

dotenv.config();

const app = express()
app.use(cors())

// Config JSON response
app.use(express.json())

// Rotas
app.use(userRoutes)
app.use(loginRoutes)
app.use(petRoutes)
app.use(adoptionRoutes)
app.use(installRoute)
app.use(docs)

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    });
};

startServer()