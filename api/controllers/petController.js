import Pet from '../models/Pet.js'

const PetController = {

    async register(req, res) {

        // #swagger.summary = 'Registra um novo pet no sistema.'
        // #swagger.tags = ['Pet']
        // #swagger.description = 'Rota para cadastrar um novo pet no sistema. Recebe os dados do pet e a imagem do pet, salva no banco de dados e retorna uma mensagem de sucesso.'
        /* #swagger.parameters['name'] = {
            in: 'body',
            description: 'Nome do pet.',
            required: true,
            type: 'string',
            example: 'Rex'
        }*/
        /* #swagger.parameters['age'] = {
            in: 'body',
            description: 'Idade do pet.',
            required: true,
            type: 'integer',
            example: 3
        }*/
        /* #swagger.parameters['breed'] = {
            in: 'body',
            description: 'Raça do pet.',
            required: true,
            type: 'string',
            example: 'Labrador'
        }*/
        /* #swagger.parameters['description'] = {
            in: 'body',
            description: 'Descrição do pet.',
            required: false,
            type: 'string',
            example: 'Pet amigável e brincalhão.'
        }*/
        /* #swagger.parameters['image'] = {
            in: 'formData',
            description: 'Imagem do pet.',
            required: false,
            type: 'file'
        }*/

        const register = req.body

        try {
            const pet = new Pet({
                name: register.name,
                age: register.age,
                breed: register.breed,
                description: register.description,
                image: req.file.path
            })

            await pet.save()

            res.status(201).json({
                msg: "Pet cadastrado com sucesso"
            });

        } catch (err) {
            res.status(500).json({
                error: "Erro no servidor"
            });
        }
    },

    async listPets(req, res) {
        // #swagger.summary = 'Lista todos os pets com paginação.'
        // #swagger.tags = ['Pet']
        // #swagger.description = 'Rota para listar todos os pets no sistema com suporte à paginação e limite de resultados por página.'
        /* #swagger.parameters['page'] = {
            in: 'query',
            description: 'Número da página a ser retornada (default é 1).',
            required: false,
            type: 'integer',
            example: 1
        }*/
        /* #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Número de pets por página (valores permitidos são 5, 10, 30; default é 5).',
            required: false,
            type: 'integer',
            example: 10
        }*/

        const { page = 1, limit = 5 } = req.query;

        const allowedValues = [5, 10, 30];

        if (!allowedValues.includes(Number(limit))) {
            return res.status(400).json({
                error: 'O limite deve ser 5, 10 ou 30.'
            });
        }

        try {
            const pets = await Pet.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            const count = await Pet.countDocuments();

            res.json({
                pets,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
            });
        } catch (err) {
            res.status(500).json({
                error: "Erro no servidor"
            });
        }
    },


    async getPetById(req, res) {

        // #swagger.summary = 'Recupera um pet pelo ID.'
        // #swagger.tags = ['Pet']
        // #swagger.description = 'Rota para recuperar as informações de um pet específico com base no ID fornecido.'
        /* #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID do pet a ser recuperado.',
            required: true,
            type: 'string',
            example: 'pet123'
        }*/

        const { id } = req.params

        try {
            const pet = await Pet.findById(id);
            if (!pet) return res.status(404).json({
                error: 'Pet não encontrado'
            });
            res.json(pet);
        } catch (err) {
            res.status(500).json({
                error: "Erro no servidor"
            });
        }
    },

    async updatePet(req, res) {

        // #swagger.summary = 'Atualiza as informações de um pet existente.'
        // #swagger.tags = ['Pet']
        // #swagger.description = 'Rota para atualizar as informações de um pet existente com base no ID fornecido. Permite atualizar todos os campos, incluindo a imagem do pet.'
        /* #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID do pet a ser atualizado.',
            required: true,
            type: 'string',
            example: 'pet123'
        }*/
        /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados para atualizar o pet.',
            schema: {
              name: 'Rex',
              age: 4,
              breed: 'Labrador',
              description: 'Pet brincalhão e carinhoso.'
            }
        }*/
        /* #swagger.parameters['image'] = {
            in: 'formData',
            description: 'Imagem do pet.',
            required: false,
            type: 'file'
        }*/

        try {

            const updateData = { ...req.body };

            if (req.file) {
                updateData.image = req.file.path;
            }

            const pet = await Pet.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!pet)
                return res.status(404).json({
                    error: 'Pet não encontrado'
                })
            res.json({
                pet
            })
        } catch (err) {
            res.status(500).json({
                error: "Erro no servidor"
            });
        }
    },

    async deletePet(req, res) {
        // #swagger.summary = 'Exclui um pet do sistema.'
        // #swagger.tags = ['Pet']
        // #swagger.description = 'Rota para excluir um pet específico do banco de dados com base no ID fornecido.'
        /* #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID do pet a ser excluído.',
            required: true,
            type: 'string',
            example: 'pet123'
        }*/

        try {
            const pet = await Pet.findByIdAndDelete(req.params.id);
            if (!pet) return res.status(404).json({
                error: 'Pet não encontrado'
            });
            res.json({
                msg: 'Pet removido com sucesso'
            });
        } catch (err) {
            res.status(500).json({
                error: "Erro no servidor"
            });
        }
    }
};

export default PetController;