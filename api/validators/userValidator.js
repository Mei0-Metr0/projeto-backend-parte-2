import Joi from 'joi';

const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({ 
    'string.base': 'Username must be a string.',
    'string.empty': 'Username cannot be empty.',
    'string.min': 'The username must be at least {#limit} characters long.',
    'string.max': 'Username must have a maximum of {#limit} characters.',
    'any.required': 'Username is required.',
  }),

  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.base': 'O e-mail deve ser uma string.',
    'string.empty': 'O e-mail não pode estar vazio.',
    'string.email': 'O e-mail deve ser um endereço de e-mail válido e conter "@".',
    'any.required': 'O e-mail é obrigatório.',
  }),

  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
    'string.empty': 'A senha não pode estar vazia.',
    'string.pattern.base': 'A senha deve conter apenas letras e números.',
    'string.min': 'A senha deve ter pelo menos {#limit} caracteres.',
    'string.max': 'A senha deve ter no máximo {#limit} caracteres.',
    'any.required': 'A senha é obrigatória.',
  }),

  confirmpassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'A confirmação da senha é obrigatória.',
  })
});

export const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }
  next();
};