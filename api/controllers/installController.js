import User from '../models/User.js';
import Pet from '../models/Pet.js';
import Adoption from '../models/Adoption.js';


const InstallController = {

    async addDataBd(req, res) {

        // #swagger.summary = 'Instala e popula o banco de dados com dados de amostra'
        // #swagger.tags = ['Database']
        // #swagger.description = 'Remove dados existentes e popula o banco de dados com usuários, pets e adoções de amostra. Atualiza o status de adoção dos pets para adotados.'

        try {
            // Remover dados existentes
            await User.deleteMany({});
            await Pet.deleteMany({});
            await Adoption.deleteMany({});

            // Criar usuários
            const users = [
                { name: 'Joice', email: 'joice@email.com', password: '123456', isAdmin: true },
                { name: 'Lucas', email: 'lucas@email.com', password: '123456', isAdmin: false },
                { name: 'Montilla', email: 'montilla@email.com', password: '123456', isAdmin: false },
                { name: 'Felippe', email: 'felippe@email.com', password: '123456', isAdmin: false },
                { name: 'Marcus Vinícius', email: 'marcus@email.com', password: '123456', isAdmin: false }
            ];

            // Hashing senhas
            for (const user of users) {
                user.password = await User.hashPassword(user.password);
            }

            const createdUsers = await User.insertMany(users);

            // Criar pets
            const pets = [
                { name: 'Luly', age: 4, breed: 'Pincher', adopted: false, description: 'Dócil' },
                { name: 'Whiskers', age: 1, breed: 'Siamese', adopted: false, description: 'Caçador' },
                { name: 'Luna', age: 4, breed: 'Basset', adopted: false, description: 'Amigável' },
                { name: 'Mittens', age: 2, breed: 'Maine Coon', adopted: false, description: 'Fofa' },
                { name: 'Haila', age: 5, breed: 'Box', adopted: false, description: 'Brincalhona' }
            ];

            const createdPets = await Pet.insertMany(pets);

            // Criar adoções
            const adoptions = [
                { user: createdUsers[0]._id, pet: createdPets[0]._id },
                { user: createdUsers[1]._id, pet: createdPets[1]._id },
                { user: createdUsers[2]._id, pet: createdPets[2]._id },
                { user: createdUsers[3]._id, pet: createdPets[3]._id },
                { user: createdUsers[4]._id, pet: createdPets[4]._id }
            ];

            await Adoption.insertMany(adoptions);

            // Atualizar status de adoção dos pets
            for (let i = 0; i < createdPets.length; i++) {
                createdPets[i].adopted = true;
                await createdPets[i].save();
            }

            res.status(200).json({ 
                msg: 'Banco de dados instalado com sucesso com dados de amostra.' 
            });
        } catch (error) {
            console.error('Error during installation:', error);
            res.status(500).json({ 
                error: 'Erro no servidor'
            });
        }
    }
};

export default InstallController;