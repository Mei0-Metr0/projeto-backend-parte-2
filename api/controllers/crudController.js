import bcrypt from 'bcrypt';

const genericController = (Model, checkExists) => {
  return {

    create: async (req, res) => {

      try {
        if (checkExists) {
          const exists = await checkExists(req.body);
          if (exists) {
            return res.status(422).json({ msg: `${Model.modelName} already exists` });
          }
        }

        if (Model.modelName === 'User') {
          const { password } = req.body;
          const salt = await bcrypt.genSalt(12);
          req.body.password = await bcrypt.hash(password, salt);
        }

        const document = new Model(req.body);
        await document.save();
        
        res.status(201).json({
            msg: `${Model.modelName} created successfully!`
        });

      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getAll: async (req, res) => {
      try {
        const documents = await Model.find();
        res.json(documents);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getById: async (req, res, next) => {
      try {
        const document = await Model.findById(req.params.id);
        if (!document) {
          return res.status(404).json({ error: 'Document not found' });
        }
        res.document = document;
        next();
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    update: async (req, res) => {
      try {
        const document = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!document) {
          return res.status(404).json({ error: 'Document not found' });
        }
        res.json(document);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    remove: async (req, res) => {
      try {
        const document = await Model.findByIdAndDelete(req.params.id);
        if (!document) {
          return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Document deleted' });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  };

};

export default genericController;
