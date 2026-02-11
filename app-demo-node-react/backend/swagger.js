const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Backend - Documentación",
      version: "1.0.0",
      description: "Documentación generada automáticamente con Swagger",
    },
    servers: [
      {
        url: "/",   // 👈 IMPORTANTE
      },
    ],
  },
  apis: ["./routes/*.js", "./index.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
