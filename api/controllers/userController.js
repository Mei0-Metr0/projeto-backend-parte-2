import User from '../models/User.js'

const UserController = {

    async register(req, res) {

        // #swagger.summary = 'Registra um novo usuário no sistema.'
        // #swagger.tags = ['User']
        // #swagger.description = 'Rota de registro que permite a criação de novos usuários no sistema. Se o email já estiver cadastrado, ela retorna um erro: "Email já cadastrado". Caso contrário, ela cria o usuário com os dados fornecidos e uma senha segura (hash).',
        /* #swagger.parameters['nome'] = {
            in: 'body',
            description: 'Nome do usuário.',
            required: true,
            type: 'string',
            example: 'João'
        }*/
        /* #swagger.parameters['email'] = {
             in: 'body',
             description: 'O email do usuário',
             required: true,
             type: 'string',
             example: 'joao@email.com'
         }*/
        /* #swagger.parameters['senha'] = {
            in: 'body',
            description: 'A senha do usuário (será hashada antes de ser salva)',
            required: true,
            type: 'string',
            example: '12345678'
        }*/
        /* #swagger.parameters['isAdmin'] = {
            in: 'body',
            description: 'Indica se o usuário tem permissões administrativas (opcional).',
            required: true,
            type: 'boolean',
            example: 'true'
        }*/

        const register = req.body

        const userExists = await User.findOne({ email: register.email })

        if (userExists) {
            return res.status(422).json({
                error: "Email já cadastrado"
            })
        }

        const passwordHash = await User.hashPassword(register.password);

        const newUser = new User({
            name: register.name,
            email: register.email,
            password: passwordHash,
            isAdmin: register.isAdmin
        });

        try {
            await newUser.save();
            res.status(201).json({
                msg: "Usuário criado com sucesso"
            });
        } catch (error) {
            res.status(500).json({
                error: "Falha ao cadastrar usuário"
            });
        }
    },

    async createAdmin(req, res) {

        // #swagger.summary = 'Atualiza um usuário para perfil de administrador'
        // #swagger.tags = ['User']
        // #swagger.description = 'Atualiza o perfil de um usuário para administrador, modificando o campo isAdmin para true com base no email fornecido.'
        /* #swagger.parameters['email'] = {
            in: 'body',
            description: 'Email do usuário',
            required: true,
            type: 'string',
            example: 'joao@email.com'
        }*/

        const { email } = req.body;

        try {
            const user = await User.findOneAndUpdate({ email }, { isAdmin: true }, { new: true })

            if (!user) {
                return res.status(404).json({
                    error: "Usuário não encontrado"
                })
            }

            res.status(200).json({
                msg: "Usuário atualizado com o perfil admin",
            });
        } catch (error) {
            res.status(500).json({
                error: "Erro no servidor"
            });
        }
    },


    async deleteUser(req, res) {

        // #swagger.summary = 'Exclui um usuário do sistema'
        // #swagger.tags = ['User']
        // #swagger.description = 'Excluir um usuário específico do banco de dados com base no ID fornecido. Não permite a exclusão de usuários com perfil de administrador.'
        /* #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID do usuário a ser excluído',
            required: true,
            type: 'string'
        }*/

        const { id } = req.params

        try {
            const user = await User.findById(id)

            if (!user) {
                return res.status(404).json({
                    error: "Usuário não encontrado"
                })
            }

            if (user.isAdmin) {
                return res.status(403).json({
                    error: "Exclusão de usuários administradores não é permitida"
                })
            }

            await user.deleteOne({ _id: user.id })
            res.json({
                msg: "Usuário removido com sucesso"
            })
        } catch (err) {
            res.status(500).json({
                error: 'Erro no servidor'
            })
        }
    },

    async updateUser(req, res) {

        // #swagger.summary = 'Atualiza um usuário no sistema'
        // #swagger.tags = ['User']
        // #swagger.description = 'Atualiza as informações de um usuário existente no banco de dados com base no ID fornecido. Somente administradores ou o próprio usuário podem fazer essa atualização.'
        /* #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID do usuário a ser atualizado',
            required: true,
            type: 'string'
        }*/

        /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados para atualizar o usuário.',
            schema: {
              name: 'João',
              email: 'joao@exemplo.com',
              password: '12345678',
              isAdmin: false
            }
        }*/

        const { id } = req.params;
        const update = req.body

        try {
            const user = await User.findById(id)

            if (!user) {
                return res.status(404).json({
                    error: "Usuário não encontrado"
                })
            }

            if (!req.user.isAdmin && req.user._id.toString() !== id) {
                return res.status(403).json({
                    error: "Não autorizado a atualizar este usuário"
                });
            }

            user.name = update.name || user.name
            user.email = update.email || user.email

            if (update.password) {
                user.password = await User.hashPassword(update.password);
            }

            user.isAdmin = update.isAdmin === undefined ? user.isAdmin : update.isAdmin

            const updatedUser = await user.save();
            res.json(updatedUser)
        } catch (err) {
            res.status(500).json({
                error: 'Erro no servidor'
            });
        }
    },

    async listCustomers(req, res) {

        // #swagger.summary = 'Lista usuários não administradores com paginação'
        // #swagger.tags = ['User']
        // #swagger.description = 'Lista os usuários não-administradores (clientes) no sistema, com suporte à paginação e limite de resultados por página.'
        /* #swagger.parameters['page'] = {
            in: 'query',
            description: 'Número da página a ser retornada (default é 1).',
            required: false,
            type: 'integer',
            example: 1
        }*/

        /* #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Número de usuários por página (valores permitidos são 5, 10, 30; default é 5).',
            required: false,
            type: 'integer',
            example: 10
        }*/
        try {
            const { page = 1, limit = 5 } = req.query;

            const allowedValues = [5, 10, 30];

            if (!allowedValues.includes(Number(limit))) {
                return res.status(400).json({
                    error: 'O limite deve ser 5, 10 ou 30.'
                });
            }

            const count = await User.countDocuments({ isAdmin: false });

            const nonAdminUsers = await User.find({ isAdmin: false })
                .limit(Number(limit)) // Limita o número de registros retornados por página. Por exemplo, se limit for 10, ele vai buscar 10 usuários.
                /*
                    Calcula quantos registros devem ser pulados com base na página solicitada.

                    Se estiver na página 1 e o limit for 10, ele vai pular 0 registros (página 1: do 0 ao 9).
                    Se estiver na página 2 e o limit for 10, ele vai pular 10 registros (página 2: do 10 ao 19).
                    ...
                */
                .skip((page - 1) * Number(limit))
                .exec();

            res.json({
                nonAdminUsers,
                totalPages: Math.ceil(count / limit), // Divide o número total de documentos pela quantidade por página (o limit). Math.ceil arredonda para cima.
                currentPage: Number(page),  
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                error: 'Erro no servidor'
            });
        }
    },

    async getLoginCount(req, res) {

        try {
            const user = await User.findById(req.user._id);

            if (!user) {
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }

            res.status(200).json({
                msg: "Usuário logou no sistema: " + user.loginCount + " vezes"
            });
        } catch (err) {
            res.status(500).json({
                error: 'Erro no servidor'
            });
        }
    },

    async getClienteById(req, res) {

        // #swagger.summary = 'Recupera um cliente pelo ID'
        // #swagger.tags = ['User']
        // #swagger.description = 'Recupera as informações de um cliente específico com base no ID fornecido'
        /* #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID do cliente a ser recuperado',
            required: true,
            type: 'string',
            example: 'user123'
        }*/

        try {
            const user = await User.findById(req.params.id)
            if (!user) return res.status(404).json({
                error: 'Usuário não encontrado'
            })
            res.json(user)
        } catch (err) {
            res.status(500).json({
                error: 'Erro no servidor'
            })
        }
    }
};

export default UserController