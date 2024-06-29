import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDatabase from './db/conn.js';

dotenv.config()

const port = process.env.DB_PORT

const app = express()
app.use(cors())
app.use(express.json())

//DB Connection
connectDatabase()

app.listen(port, function() {
    console.log(`Servidor rodando na porta ${port}`);
})
