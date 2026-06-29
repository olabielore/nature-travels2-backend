import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Invalid id format');
  }
  return value;
};

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(32).trim(),
    email: Joi.string().email().max(64),
  }).min(1),
};

export const getAllUsersSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(20).default(10),
    search: Joi.string().trim().optional(),
  }),
};

export const getUserByIdSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const saveStorySchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const deleteStorySchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const verifyUserSchema = {
  [Segments.PARAMS]: Joi.object({
    token: Joi.string().min(10).required(),
  }),
};

// export const updateUserSchema = {
//   [Segments.PARAMS]: Joi.object({
//     userId: Joi.string().custom(objectIdValidator).required(),
//   }),
//   [Segments.QUERY]: Joi.object({
//     page: Joi.number().integer().min(1).default(1),
//     perPage: Joi.number().integer().min(5).max(20).default(10),
//     search: Joi.string().trim().allow(''),
//   }).min(1),
// };
