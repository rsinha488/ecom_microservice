import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3002),
  MONGO_URI: Joi.string().required(),
  PRODUCT_DB_NAME: Joi.string().default('products_db'),
  KAFKA_BROKERS: Joi.string().required(),
  ELASTICSEARCH_NODE: Joi.string().required(),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
});

export default registerAs('product', () => ({
  port: parseInt(process.env.PORT!, 10) || 3002,
  database: {
    uri: process.env.MONGO_URI,
    name: process.env.PRODUCT_DB_NAME,
  },
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(','),
  },
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE,
  },
  environment: process.env.NODE_ENV,
}));