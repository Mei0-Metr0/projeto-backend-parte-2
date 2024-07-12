import Adoption from '../models/Adoption.js'
import Pet from '../models/Pet.js'

const AdoptionController = {

    async register(req, res) {
        const { pet } = req.body;

        try {
            const animal = await Pet.findById(pet);

            if (!animal) {
                return res.status(404).json({
                    error: 'Pet not found'
                });
            }

            if (animal.adopted) {
                return res.status(400).json({
                    error: 'Pet already adopted'
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
                msg: "Successful adoption"
            });

        } catch (err) {
            res.status(500).json({
                error: "Server error",
                err
            });
        }
    },

    async listAdoptions(req, res) {
        const { page = 1, limit = 5 } = req.query;

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
                error: "Server error"
            });
        }
    },


    async getAdoptionById(req, res) {

        const { id } = req.params

        try {
            const adoption = await Adoption.findById(id).populate('pet');

            if (!adoption) return res.status(404).json({
                error: 'Adoption not found'
            });

            if (adoption.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            res.json(adoption);

        } catch (err) {
            res.status(500).json({
                error: "Server error"
            });
        }
    },

    async updateAdoption(req, res) {
        try {
            const adoption = await Adoption.findById(req.params.id);

            if (!adoption)
                return res.status(404).json({
                    error: 'Adoption not found'
                });

            if (adoption.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            if (req.body.pet) {
                const newPet = await Pet.findById(req.body.pet);
                if (!newPet) {
                    return res.status(404).json({ error: 'Pet not found' });
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
                error: "Server error"
            });
        }
    },

    async deleteAdoption(req, res) {
        try {
            const adoption = await Adoption.findById(req.params.id);

            if (!adoption)
                return res.status(404).json({
                    error: 'Adoption not found'
                });

            if (adoption.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const pet = await Pet.findById(adoption.pet);

            if (pet) {
                pet.adopted = false;
                await pet.save();
            }

            await adoption.deleteOne({ _id: adoption.id })

            res.json({
                msg: 'Adoption removed successfully'
            });
        } catch (err) {
            res.status(500).json({
                error: `Server error ${err}`
            });
        }
    }
};

export default AdoptionController