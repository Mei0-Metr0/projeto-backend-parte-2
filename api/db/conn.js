import mongoose from "mongoose";

async function connectDatabase() {

    const cluster = process.env.DB_CLUSTER
    const username = process.env.DB_USERNAME
    const password = process.env.DB_PASSWORD

    const uri = `mongodb+srv://${username}:${password}@${cluster}.pyepj0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-backend-805b`

    try {
        await mongoose.connect(uri)
        console.log('Conexão com o banco de dados estabelecida com sucesso');
    } catch (error) {
        console.log(`Erro ao conectar com o banco de dados ${error}`)
    }
}

export default connectDatabase