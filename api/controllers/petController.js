import Pet from '../models/Pet.js'

//Depois de colocar a validação adicione o req.body direto no objeto
const PetController = {

    async register(req, res) {
        const { name, age, breed, description } = req.body

        try {
            const pet = new Pet({ name, age, breed, description })
            await pet.save()
            res.status(201).json({
                msg: "Pet created successfully!"
            });

        } catch (err) {
            res.status(500).json({
                error: "Server error"
            });
        }
    },

    async listPets(req, res) {
        const { page = 1, limit = 5 } = req.query;

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
                error: "Server error"
            });
        }
    },


    async getPetById(req, res) {

        const { id } = req.params

        try {
            const pet = await Pet.findById(id);
            if (!pet) return res.status(404).json({
                error: 'Pet not found'
            });
            res.json(pet);
        } catch (err) {
            res.status(500).json({
                error: "Server error"
            });
        }
    },

    async updatePet(req, res) {

        try {
            const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!pet)
                return res.status(404).json({
                    error: 'Pet not found'
                })
            res.json({
                pet
            })
        } catch (err) {
            res.status(500).json({
                error: "Server error"
            });
        }
    },

    async deletePet(req, res) {
        try {
            const pet = await Pet.findByIdAndDelete(req.params.id);
            if (!pet) return res.status(404).json({
                error: 'Pet not found'
            });
            res.json({
                msg: 'Pet removed successfully'
            });
        } catch (err) {
            res.status(500).json({
                error: "Server error"
            });
        }
    }
};

export default PetController