const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const itemsRouter = require('./routes/items');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/items', itemsRouter);

// Puerto 
const PORT = process.env.PORT || 3030;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});

// Exportar para pruebas
module.exports = server;



