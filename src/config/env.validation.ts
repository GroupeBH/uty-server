import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // HTTP
  PORT: Joi.number().default(3000),

  // Mongo
  MONGO_URI: Joi.string().uri().required(),

  // Redis
  REDIS_URL: Joi.string().uri().required(),

  // RabbitMQ
  RABBITMQ_URL: Joi.string().uri().required(),

  // S3
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  S3_REGION: Joi.string().required(),
  S3_BUCKET: Joi.string().required(),

  // Auth
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),

  // Notifications
  FCM_SERVER_KEY: Joi.string().optional(),
});

