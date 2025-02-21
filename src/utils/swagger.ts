import swaggerJSDoc from "swagger-jsdoc";

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
    apis: ['../routes/*.routes.ts'], // Point to route files
  };
  export const swaggerSpec = swaggerJSDoc(swaggerOptions);