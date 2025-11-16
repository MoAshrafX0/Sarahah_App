// =====================================> messageSchema <====================================
export const messageSchema = {
  body: Joi.object({
    content: Joi.string().required(),
    type: Joi.string().valid("text", "image", "video").required(),
    receiverId: Joi.string().required(),
  }),
};
