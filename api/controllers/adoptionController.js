import Adoption from '../models/Adoption.js'
import Pet from '../models/Pet.js'

const AdoptionController = {

    async register(req, res) {

        // #swagger.summary = 'Registra uma nova adoção de pet'
        // #swagger.tags = ['Adoption']
        // #swagger.description = 'Registra uma nova adoção de pet, marcando o pet como adotado. Verifica se o pet existe e se não está já adotado.'
        /* #swagger.parameters['pet'] = {
            in: 'body',
            description: 'ID do pet a ser adotado',
            required: true,
            type: 'string',
            example: 'pet123'
        }*/

        const { pet } = req.body;

        try {
            const animal = await Pet.findById(pet);

            if (!animal) {
                return res.status(404).json({
                    error: 'Pet não encontrado'
                });
            }

            if (animal.adopted) {
                return res.status(400).json({
                    error: 'Pet já adotado'
                });
            }

            const adoption = new Adoption({
                user: req.user._id,
                pet: req.body.pet,
            });

            await adoption.save();
            animal.adopted = true;
            await animal.save();

            res.status(201).json({
                msg: "Adoção concluída"
            });

        } catch (err) {
            res.status(500).json({
                error: "Erro no servidor"
            });
        }
    },

    async listAdoptions(req, res) {

        // #swagger.summary = 'Lista as adoções do usuário com paginação'
        // #swagger.tags = ['Adoption']
        // #swagger.description = 'Lista todas as adoções do usuário com suporte à paginação e limite de resultados por página.'
        /* #swagger.parameters['page'] = {
            in: 'query',
            description: 'Número da página a ser retornada (default é 1).',
            required: false,
            type: 'integer',
            example: 1
        }*/

        /* #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Número de adoções por página (valores permitidos são 5, 10, 30; default é 5).',
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
            const adoptions = await Adoption.find({ user: req.user._id })
                .populate('pet')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            const count = await Adoption.countDocuments({ user: req.user._id });

            res.json({
                adoptions,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
            });
        } catch (err) {
            res.status(500).json({
                error: "Erro no servidor"
            });
        }
    },


    async getAdoptionById(req, res) {

        // #swagger.summary = 'Recupera uma adoção pelo ID'
        // #swagger.tags = ['Adoption']
        // #swagger.description = 'Recupera as informações de uma adoção específica com base no ID fornecido.'
        /* #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID da adoção a ser recuperada',
            required: true,
            type: 'string',
            example: 'adoption123'
        }*/

        const { id } = req.params

        try {
            const adoption = await Adoption.findById(id).populate('pet');

            if (!adoption) return res.status(404).json({
                error: 'Adoção não encontrada'
            });

            if (adoption.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ 
                    error: 'Não autorizado' 
                });
            }

            res.json(adoption);

        } catch (err) {
            res.status(500).json({
                error: "Erro no servidor"
            });
        }
    },

    async updateAdoption(req, res) {

        // #swagger.summary = 'Atualiza uma adoção existente'
        // #swagger.tags = ['Adoption']
        // #swagger.description = 'Atualiza uma adoção existente, permitindo a mudança do pet adotado. Verifica se a adoção pertence ao usuário autenticado.'
        /* #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID da adoção a ser atualizada',
            required: true,
            type: 'string',
            example: 'adoption123'
        }*/

        /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados para atualizar a adoção.',
            schema: {
                pet: 'pet456'
            }
        }*/
        try {
            const adoption = await Adoption.findById(req.params.id);

            if (!adoption)
                return res.status(404).json({
                    error: 'Adoção não encontrada'
                });

            if (adoption.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ 
                    error: 'Não autorizado' 
                });
            }

            if (req.body.pet) {
                const newPet = await Pet.findById(req.body.pet);
                if (!newPet) {
                    return res.status(404).json({ 
                        error: 'Pet não encontrado' 
                    });
                }

                const currentPet = await Pet.findById(adoption.pet);
                if (currentPet) {
                    currentPet.adopted = false;
                    await currentPet.save();
                }

                newPet.adopted = true;
                await newPet.save();

                adoption.pet = req.body.pet;
            }

            await adoption.save();

            res.json(adoption);
        } catch (err) {
            res.status(500).json({
                error: "Erro no servidor"
            });
        }
    },

    async deleteAdoption(req, res) {

        // #swagger.summary = 'Exclui uma adoção existente'
        // #swagger.tags = ['Adoption']
        // #swagger.description = 'Exclui uma adoção existente com base no ID fornecido. Verifica se a adoção pertence ao usuário autenticado e atualiza o status do pet para não adotado.'
        /* #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID da adoção a ser excluída',
            required: true,
            type: 'string',
            example: 'adoption123'
        }*/

        try {
            const adoption = await Adoption.findById(req.params.id);

            if (!adoption)
                return res.status(404).json({
                    error: 'Adoção não encontrada'
                });

            if (adoption.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ 
                    error: 'Não autorizado' 
                });
            }

            const pet = await Pet.findById(adoption.pet);

            if (pet) {
                pet.adopted = false;
                await pet.save();
            }

            await adoption.deleteOne({ _id: adoption.id })

            res.json({
                msg: 'Adoção removida com sucesso'
            });
        } catch (err) {
            res.status(500).json({
                error: 'Erro no servidor'
            });
        }
    }
};

export default AdoptionController