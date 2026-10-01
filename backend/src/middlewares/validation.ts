import { celebrate, Joi, Segments } from 'celebrate';

export const validateProductBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required().min(2).max(30).messages({
      'string.empty': 'Поле "title" должно быть заполнено',
      'string.min': 'Минимальная длина поля "title" - 2',
      'string.max': 'Максимальная длина поля "title" - 30',
      'any.required': 'Поле "title" должно быть заполнено',
    }),
    image: Joi.object()
      .keys({
        fileName: Joi.string().required().messages({
          'string.empty': 'Поле "image.fileName" должно быть заполнено',
          'any.required': 'Поле "image.fileName" должно быть заполнено',
        }),
        originalName: Joi.string().required().messages({
          'string.empty': 'Поле "image.originalName" должно быть заполнено',
          'any.required': 'Поле "image.originalName" должно быть заполнено',
        }),
      })
      .required()
      .messages({
        'any.required': 'Поле "image" должно быть заполнено',
      }),
    category: Joi.string().required().messages({
      'string.empty': 'Поле "category" должно быть заполнено',
      'any.required': 'Поле "category" должно быть заполнено',
    }),
    description: Joi.string().allow(null, ''),
    price: Joi.number().allow(null).default(null),
  }),
});

export const validateOrderBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().required().valid('card', 'online').messages({
      'any.only': 'Поле "payment" должно быть card или online',
      'any.required': 'Поле "payment" должно быть заполнено',
    }),
    email: Joi.string().required().email().messages({
      'string.email': 'Поле "email" должно быть валидным email',
      'any.required': 'Поле "email" должно быть заполнено',
    }),
    phone: Joi.string().required().messages({
      'string.empty': 'Поле "phone" должно быть заполнено',
      'any.required': 'Поле "phone" должно быть заполнено',
    }),
    address: Joi.string().required().messages({
      'string.empty': 'Поле "address" должно быть заполнено',
      'any.required': 'Поле "address" должно быть заполнено',
    }),
    total: Joi.number().required().messages({
      'number.base': 'Поле "total" должно быть числом',
      'any.required': 'Поле "total" должно быть заполнено',
    }),
    items: Joi.array().required().items(Joi.string().hex().length(24)).min(1).messages({
      'array.min': 'Поле "items" должно быть непустым массивом',
      'string.hex': 'Поле "items" должно содержать корректные _id товаров',
      'string.length': 'Поле "items" должно содержать корректные _id товаров',
      'any.required': 'Поле "items" должно быть заполнено',
    }),
  }),
});
