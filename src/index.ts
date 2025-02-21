import express from "express";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import { notFoundRoute } from "./controllers/misc.controller.js";
import { companyRoutes } from './routes/company.routes.js';
import { connectRedis } from "./services/redis.service.js";

dotenv.config();

const app = express();
app.use(express.json());


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Company API',
      version: '1.0.0',
      description: 'API for company historical data operations',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}/api` }],
    components: {
      schemas: {
        CompanyRequest: {
          type: 'object',
          required: ['symbol', 'startDate', 'endDate', 'email'],
          properties: {
            symbol: { 
              type: 'string', 
              example: 'AAPL',
              description: 'Valid NASDAQ company symbol'
            },
            startDate: { 
              type: 'string', 
              format: 'date',
              example: '2023-01-01',
              description: 'Start date in YYYY-MM-DD format'
            },
            endDate: { 
              type: 'string', 
              format: 'date',
              example: '2023-01-31',
              description: 'End date in YYYY-MM-DD format'
            },
            email: { 
              type: 'string', 
              format: 'email',
              example: 'user@example.com',
              description: 'Valid email address'
            }
          }
        },
        HistoricalData: {
          type: 'object',
          properties: {
            date: { 
              type: 'string', 
              format: 'date',
              example: '2023-01-01'
            },
            open: { 
              type: 'number',
              example: 130.85
            },
            high: { 
              type: 'number',
              example: 133.41
            },
            low: { 
              type: 'number',
              example: 129.89
            },
            close: { 
              type: 'number',
              example: 131.86
            },
            volume: { 
              type: 'number',
              example: 78534200
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.routes.ts'], // Point to route files
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);


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
