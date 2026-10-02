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
        fileName: Joi.string().required().min(2).max(255).messages({
          'string.empty': 'Поле "image.fileName" должно быть заполнено',
          'string.min': 'Минимальная длина поля "image.fileName" - 2',
          'string.max': 'Максимальная длина поля "image.fileName" - 255',
          'any.required': 'Поле "image.fileName" должно быть заполнено',
        }),
        originalName: Joi.string().required().min(2).max(255).messages({
          'string.empty': 'Поле "image.originalName" должно быть заполнено',
          'string.min': 'Минимальная длина поля "image.originalName" - 2',
          'string.max': 'Максимальная длина поля "image.originalName" - 255',
          'any.required': 'Поле "image.originalName" должно быть заполнено',
        }),
      })
      .required()
      .messages({
        'any.required': 'Поле "image" должно быть заполнено',
      }),
    category: Joi.string().required().min(2).max(30).messages({
      'string.empty': 'Поле "category" должно быть заполнено',
      'string.min': 'Минимальная длина поля "category" - 2',
      'string.max': 'Максимальная длина поля "category" - 30',
      'any.required': 'Поле "category" должно быть заполнено',
    }),
    description: Joi.string().min(2).max(1000).allow(null).messages({
      'string.empty': 'Поле "description" должно быть заполнено',
      'string.min': 'Минимальная длина поля "description" - 2',
      'string.max': 'Максимальная длина поля "description" - 1000',
    }),
    price: Joi.number().allow(null).default(null),
  }),
});

export const validateProductUpdateBody = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      title: Joi.string().min(2).max(30).messages({
        'string.empty': 'Поле "title" должно быть заполнено',
        'string.min': 'Минимальная длина поля "title" - 2',
        'string.max': 'Максимальная длина поля "title" - 30',
      }),
      image: Joi.object().keys({
        fileName: Joi.string().required().min(2).max(255).messages({
          'string.empty': 'Поле "image.fileName" должно быть заполнено',
          'string.min': 'Минимальная длина поля "image.fileName" - 2',
          'string.max': 'Максимальная длина поля "image.fileName" - 255',
          'any.required': 'Поле "image.fileName" должно быть заполнено',
        }),
        originalName: Joi.string().required().min(2).max(255).messages({
          'string.empty': 'Поле "image.originalName" должно быть заполнено',
          'string.min': 'Минимальная длина поля "image.originalName" - 2',
          'string.max': 'Максимальная длина поля "image.originalName" - 255',
          'any.required': 'Поле "image.originalName" должно быть заполнено',
        }),
      }),
      category: Joi.string().min(2).max(30).messages({
        'string.empty': 'Поле "category" должно быть заполнено',
        'string.min': 'Минимальная длина поля "category" - 2',
        'string.max': 'Максимальная длина поля "category" - 30',
      }),
      description: Joi.string().min(2).max(1000).allow(null).messages({
        'string.empty': 'Поле "description" должно быть заполнено',
        'string.min': 'Минимальная длина поля "description" - 2',
        'string.max': 'Максимальная длина поля "description" - 1000',
      }),
      price: Joi.number().allow(null),
    })
    .min(1)
    .messages({
      'object.min': 'Необходимо передать хотя бы одно поле для обновления',
    }),
});

export const validateProductId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    productId: Joi.string().required().hex().length(24).messages({
      'string.hex': 'Передан некорректный _id товара',
      'string.length': 'Передан некорректный _id товара',
      'any.required': 'Передан некорректный _id товара',
    }),
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

export const validateRegisterBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.empty': 'Поле "name" должно быть заполнено',
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
    }),
    email: Joi.string().required().email().min(5).max(254).messages({
      'string.empty': 'Поле "email" должно быть заполнено',
      'string.email': 'Поле "email" должно быть валидным email',
      'string.min': 'Минимальная длина поля "email" - 5',
      'string.max': 'Максимальная длина поля "email" - 254',
      'any.required': 'Поле "email" должно быть заполнено',
    }),
    password: Joi.string().required().min(6).messages({
      'string.empty': 'Поле "password" должно быть заполнено',
      'string.min': 'Минимальная длина поля "password" - 6',
      'any.required': 'Поле "password" должно быть заполнено',
    }),
  }),
});

export const validateLoginBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'Поле "email" должно быть заполнено',
      'string.email': 'Поле "email" должно быть валидным email',
      'any.required': 'Поле "email" должно быть заполнено',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Поле "password" должно быть заполнено',
      'any.required': 'Поле "password" должно быть заполнено',
    }),
  }),
});
