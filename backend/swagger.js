// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Driver Registration & Chat API',
      version: '1.0.0',
      description: 'เอกสาร Swagger สำหรับ API ของระบบ',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Server',
      },
    ],
  },
  apis: ['./All-Routes/*.js', './driverRoutes/*.js', './app.js'], // เส้นทางที่ใส่ Swagger Docs
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
