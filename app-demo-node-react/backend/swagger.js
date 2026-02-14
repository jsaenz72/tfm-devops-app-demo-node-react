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
    components: {
      schemas: {
        Empresa: {
          type: "object",
          properties: {
            nombreEmpresa: { type: "string" },
            nombreComercial: { type: "string" },
            ruc: { type: "string" },
            telefono: { type: "string" },
            direccion: { type: "string" },
            puntoEmision: { type: "string" }
          }
        },
        Cliente: {
          type: "object",
          properties: {
            identificacion: { type: "string" },
            nombre: { type: "string" },
            direccion: { type: "string" },
            telefono: { type: "string" },
            correoElectronico: { type: "string" }
          }
        },
        DetalleItem: {
          type: "object",
          properties: {
            codigo: { type: "integer" },
            cantidad: { type: "number" },
            descripcion: { type: "string" },
            precioUnitario: { type: "number" },
            pagaIVA: { type: "boolean" },
            precioTotal: { type: "number" }
          }
        },
        Totales: {
          type: "object",
          properties: {
            subtotalConIVA: { type: "number" },
            subtotalSinIVA: { type: "number" },
            ivaTotal: { type: "number" },
            valorTotal: { type: "number" }
          }
        },
        Audit: {
          type: "object",
          properties: {
            fechaCreacion: { type: "string", format: "date-time" },
            usuarioCreacion: { type: "string" },
            fechaActualizacion: { type: "string", format: "date-time", nullable: true },
            usuarioActualizacion: { type: "string", nullable: true }
          }
        },
        FacturaInput: {
          type: "object",
          required: ["cabecera", "detalle"],
          properties: {
            cabecera: {
              type: "object",
              properties: {
                fecha: { type: "string", format: "date" },
                formaPago: { type: "string" },
                cliente: { $ref: "#/components/schemas/Cliente" }
              }
            },
            detalle: {
              type: "array",
              items: { $ref: "#/components/schemas/DetalleItem" }
            }
          }
        },
        Factura: {
          type: "object",
          properties: {
            id: { type: "integer" },
            empresa: { $ref: "#/components/schemas/Empresa" },
            cliente: { $ref: "#/components/schemas/Cliente" },
            cabecera: {
              type: "object",
              properties: {
                numeroFactura: { type: "integer" },
                claveAcceso: { type: "string" },
                estado: { type: "string" },
                numeroAutorizacion: { type: "string" },
                fechaAutorizacion: { type: "string", format: "date-time" },
                ambiente: { type: "string" },
                fecha: { type: "string", format: "date" },
                formaPago: { type: "string" }
              }
            },
            detalle: {
              type: "array",
              items: { $ref: "#/components/schemas/DetalleItem" }
            },
            totales: { $ref: "#/components/schemas/Totales" },
            audit: { $ref: "#/components/schemas/Audit" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js", "./src/index.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
