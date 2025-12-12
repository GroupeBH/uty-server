import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // HTTP
  PORT: Joi.number().default(3000),

  // Mongo
  MONGO_URI: Joi.string().uri().default('mongodb://localhost:27017/uty'),
  MONGO_DB: Joi.string().optional(),

  // Redis
  REDIS_URL: Joi.string().uri().default('redis://localhost:6379'),

  // RabbitMQ
  RABBITMQ_URL: Joi.string().uri().default('amqp://guest:guest@localhost:5672'),

  // S3
  AWS_ACCESS_KEY_ID: Joi.string().default('changeme'),
  AWS_SECRET_ACCESS_KEY: Joi.string().default('changeme'),
  S3_REGION: Joi.string().default('us-east-1'),
  S3_BUCKET: Joi.string().default('uty-media'),

  // Auth
  JWT_SECRET: Joi.string().default('changeme'),
  JWT_EXPIRES_IN: Joi.string().default('1d'),

  // Notifications
  FCM_SERVER_KEY: Joi.string().optional(),

  // OAuth providers (optional)
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().optional(),
  GOOGLE_CALLBACK_URL: Joi.string().uri().optional(),

  FACEBOOK_APP_ID: Joi.string().optional(),
  FACEBOOK_APP_SECRET: Joi.string().optional(),
  FACEBOOK_CALLBACK_URL: Joi.string().uri().optional(),

  APPLE_CLIENT_ID: Joi.string().optional(),
  APPLE_TEAM_ID: Joi.string().optional(),
  APPLE_KEY_ID: Joi.string().optional(),
  APPLE_PRIVATE_KEY: Joi.string().optional(),
  APPLE_CALLBACK_URL: Joi.string().uri().optional(),
});

