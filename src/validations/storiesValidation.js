import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Invalid id format');
  }
  return value;
};

export const getAllStoriesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    category: Joi.string().custom(objectIdValidator),
    rate: Joi.number().integer().min(1).max(20),
    search: Joi.string().trim().allow(''),
  }),
};

export const storyIdSchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const createStorySchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    article: Joi.string().allow(''),
    category: Joi.string().custom(objectIdValidator).required(),
    img: Joi.string().uri().required(),
    date: Joi.date().required(),
  }),
};

export const updateStorySchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    article: Joi.string().allow(''),
    category: Joi.string().custom(objectIdValidator).required(),
  }).min(1),
};

export const getMyStoriesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};

export const recommendedStoriesSchema = {
  [Segments.QUERY]: Joi.object({
    category: Joi.string().custom(objectIdValidator).required(),
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const savedStoriesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};

export const toggleSaveStorySchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};
