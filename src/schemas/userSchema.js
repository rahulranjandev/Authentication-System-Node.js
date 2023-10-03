import Joi from 'joi';

const registerUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(50).messages({
    'string.base': 'Name should be a type of text',
    'string.empty': 'Name is required',
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email should be a type of text',
    'string.empty': 'Email is required',
    'string.email': 'Email format is invalid',
  }),
  password: Joi.string().required().min(6).max(50).messages({
    'string.base': 'Password should be a type of text',
    'string.empty': 'Password is required',
    'string.min': 'Password should have a minimum length of {#limit}',
    'string.max': 'Password should have a maximum length of {#limit}',
  }),
  avatar: Joi.string().uri().allow(null, '').messages({
    'string.base': 'Avatar should be a type of text',
    'string.uri': 'Avatar should be a valid URL',
  }),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email should be a type of text',
    'string.empty': 'Email is required',
    'string.email': 'Email format is invalid',
  }),
  password: Joi.string().required().min(6).max(50).messages({
    'string.base': 'Password should be a type of text',
    'string.empty': 'Password is required',
    'string.min': 'Password should have a minimum length of {#limit}',
    'string.max': 'Password should have a maximum length of {#limit}',
  }),
});

const updateUserSchema = Joi.object({
  name: Joi.string().optional().min(3).max(50).messages({
    'string.base': 'Name should be a type of text',
    'string.empty': 'Name is required',
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
  }),
  email: Joi.string().email().optional().messages({
    'string.base': 'Email should be a type of text',
    'string.empty': 'Email is required',
    'string.email': 'Email format is invalid',
  }),
  avatar: Joi.string().uri().allow(null, '').messages({
    'string.base': 'Avatar should be a type of text',
    'string.uri': 'Avatar should be a valid URL',
  }),
});

const updatePasswordSchema = Joi.object({
  password: Joi.string().required().min(6).max(50).messages({
    'string.base': 'Password should be a type of text',
    'string.empty': 'Password is required',
    'string.min': 'Password should have a minimum length of {#limit}',
    'string.max': 'Password should have a maximum length of {#limit}',
  }),
  newPassword: Joi.string().required().min(6).max(50).messages({
    'string.base': 'Password should be a type of text',
    'string.empty': 'Password is required',
    'string.min': 'Password should have a minimum length of {#limit}',
    'string.max': 'Password should have a maximum length of {#limit}',
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email should be a type of text',
    'string.empty': 'Email is required',
    'string.email': 'Email format is invalid',
  }),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().required().min(6).max(50).messages({
    'string.base': 'Password should be a type of text',
    'string.empty': 'Password is required',
    'string.min': 'Password should have a minimum length of {#limit}',
    'string.max': 'Password should have a maximum length of {#limit}',
  }),
  confirmPassword: Joi.string().required().min(6).max(50).messages({
    'string.base': 'Password should be a type of text',
    'string.empty': 'Password is required',
    'string.min': 'Password should have a minimum length of {#limit}',
    'string.max': 'Password should have a maximum length of {#limit}',
  }),
});

export {
  registerUserSchema,
  userLoginSchema,
  updateUserSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
