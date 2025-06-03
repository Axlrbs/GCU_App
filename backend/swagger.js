const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API GCU',
    version: '1.0.0',
    description: 'Documentation de l’API GCU pour les étudiants, mobilités, stages, etc.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Serveur local',
    },
    {
      url: 'https://apigcuadmin.gcu-insa.fr',
      description: 'Serveur o2switch',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
