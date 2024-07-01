const create = (Model) => async (req, res) => {
    try {
        const document = new Model(req.body);
        const newDocument = await document.save();
        res.status(201).json(newDocument);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getAll = (Model) => async (req, res) => {
    try {
        const documents = await Model.find();
        res.json(documents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getById = (Model) => async (req, res, next) => {
    let document;
    try {
        document = await Model.findById(req.params.id);
        if (document == null) {
            return res.status(404).json({ message: 'Documento não encontrado' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.document = document;
    next();
};

const update = (Model) => async (req, res) => {
    try {
        const updatedDocument = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedDocument) {
            return res.status(404).json({ message: 'Documento não encontrado' });
        }
        res.json(updatedDocument);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const remove = (Model) => async (req, res) => {
    try {
        const document = await Model.findByIdAndDelete(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Documento não encontrado' });
        }
        res.json({ message: 'Documento deletado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const crudController = (Model) => ({
    create: create(Model),
    getAll: getAll(Model),
    getById: getById(Model),
    update: update(Model),
    remove: remove(Model),
});

export default crudController;  