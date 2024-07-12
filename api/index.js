import express from "express"
import cors from "cors"
import dotenv from 'dotenv';

import loginRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import petRoutes from './routes/petRoutes.js'
import adoptionRoutes from './routes/adoptionRoutes.js'

import connectDatabase from './db/conn.js'

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

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    });
};

startServer()