import jwt from 'jsonwebtoken'
import User from '../models/User.js'

async function checkToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ 
            msg: "Acesso negado, token ausente" 
        })
    }

    try {
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret)
        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(404).json({ 
                msg: "Usuário não encontrado" 
            })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ 
            msg: "Token inválido" 
        })
    }
}

async function checkAdmin(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({ 
            msg: "Acesso negado" 
        })
    }

    try {
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret)
        const user = await User.findById(decoded.id)

        if (!user || !user.isAdmin) {
            return res.status(403).json({ 
                msg: "Acesso negado, usuário não é um administrador" 
            })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(400).json({ 
            msg: "Usuário de token inválido" 
        })
    }
}

export { checkToken, checkAdmin }