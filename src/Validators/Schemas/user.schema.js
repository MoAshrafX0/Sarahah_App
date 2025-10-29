import Joi from "joi";

// =====================================> siginUpSchema <====================================
export const siginUpSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    age: Joi.number().min(18).max(100).required(),
    gender: Joi.string().valid("male", "female").required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required().regex(/^[a-zA-Z0-9]{6,16}$/),
    role: Joi.string().valid("admin", "user").required(),
    phoneNumber: Joi.string().required(),
  }),
};
 