import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.base': 'O e-mail deve ser uma string.',
    'string.empty': 'O e-mail não pode estar vazio.',
    'string.email': 'O e-mail deve ser um endereço de e-mail válido e conter "@".',
    'any.required': 'O e-mail é obrigatório.',
  }),
  password: Joi.string().required().messages({
    'string.base': 'A senha deve ser uma string.',
    'string.empty': 'A senha não pode estar vazia.',
    'any.required': 'A senha é obrigatória.',
  })
});

export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }
  next();
};