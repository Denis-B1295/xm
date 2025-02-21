import express from "express";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express';
import { notFoundRoute } from "./controllers/misc.controller.js";
import { companyRoutes } from './routes/company.routes.js';
import { connectRedis } from "./services/redis.service.js";
import { swaggerSpec } from "./utils/swagger.js";

dotenv.config();

const app = express();
app.use(express.json());


const startServer = async () => {
  if(!process.env.REDIS_URL){
      throw `Env var REDIS_URL is not set`;
  }
  await connectRedis();

  const companyApi = await companyRoutes(express.Router());
  
  app.use('/api', companyApi);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('*', notFoundRoute);

  app.listen(process.env.PORT || 3000, () => {
    console.log(`[server]: Server is running at http://localhost:${process.env.PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
