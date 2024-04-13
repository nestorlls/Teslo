import * as Joi from 'joi';

export const JoinValidationsSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  API_NAME: Joi.string().default('Teslo API - Shop'),
  API_PREFIX: Joi.string().required(),
});
