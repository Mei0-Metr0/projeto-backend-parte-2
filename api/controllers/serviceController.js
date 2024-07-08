import Service from '../models/Service.js'

const ServiceController = {

    async createService(req, res) {
        const { name, description, price } = req.body

        try {
            const service = new Service({ name, description, price })
            await service.save()
            res.status(201).json({ 
                msg: "Service created successfully!" 
            });
            
        } catch (err) {
            res.status(500).json({
                error: "Server error"
            });
        }
    },

    async listServices (req, res) {
        const { page = 1, limit = 5 } = req.query;

        try {
            const services = await Service.find()
                .skip((page - 1) * limit)
                .limit(parseInt(limit));
            res.json(services);
        } catch (err) {
            res.status(500).json({
                error: "Server error"
            });
        }
    },


    async getServiceById (req, res) {

        const { id } = req.params
        console.log(id)

        try {
            const servico = await Service.findById(id);
            if (!servico) return res.status(404).json({ 
                error: 'Service not found' 
            });
            res.json(servico);
        } catch (err) {
            res.status(500).json({
                error: "Server error"
            });
        }
    },

    async updateService (req, res) {

        try {
            const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!service) 
                return res.status(404).json({ 
                    error: 'Service not found' 
                })
            res.json({ 
                message: 'Serviço atualizado com sucesso', 
                service 
            })
        } catch (err) {
            res.status(500).json({
                error: "Server error"
            });
        }
    },

    async deleteService (req, res) {
        try {
            const service = await Service.findByIdAndDelete(req.params.id);
            if (!service) return res.status(404).json({ 
                error: 'Service not found' 
            });
            res.json({ 
                msg: 'Service removed successfully' 
            });
        } catch (err) {
            res.status(500).json({
                error: "Server error"
            });
        }
    }
};

export default ServiceController