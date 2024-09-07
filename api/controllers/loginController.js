import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

import User from '../models/User.js'


const LoginController = {

    async login (req, res) {

        /*  
            #swagger.summary = 'Rota de autenticação de usuários'
            #swagger.tags = ['Login']
            #swagger.description = 'Permite que o usuário faça login com seu email e senha. Se as credenciais forem válidas, um token JWT será gerado e retornado para o cliente. Em caso de falha, a rota retornará um erro apropriado, como "Usuário não encontrado" ou "Senha inválida"'
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'Informações de login',
                required: true,
                schema: { 
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'email@example.com' },
                        senha: { type: 'string', example: 'password123' }
                    }
                }
            } 
        */

        const login = req.body

        const user = await User.findOne({ email: login.email})

        if(!user) {
            return res.status(404).json({
                error: "Usuário não encontrado"
            })
        }

        const checkPassword = await bcrypt.compare(login.password, user.password)

        if(!checkPassword) {
            return res.status(422).json({
                error: 'Senha inválida'
            })
        }

        try {

            const jwtSecret = process.env.SECRET
            const jwtExpire = process.env.JWTEXPIRE

            // Gera um token assinado com base em três parâmetros: Payload, Secret e Configurações adicionais como o tempo de expiração do token.
            //Dá para colocar qualquer payload
            const token = jwt.sign(
                {
                    id: user._id,
                }, // Chave secreta usada para assinar o token. Ela é uma string secreta conhecida apenas pelo servidor. Quando o token é enviado de volta ao servidor, o servidor usa essa chave secreta para validar se o token foi realmente gerado por ele e se não foi modificado.
                jwtSecret, { expiresIn: jwtExpire }
            )

            await user.incrementLoginCount();

            res.status(200).json({
                msg: "Login realizado com sucesso", token
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: "Erro no servidor"
            })
        }
    }
};

export default LoginController