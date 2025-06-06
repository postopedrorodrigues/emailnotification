const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Servidor está rodando!' });
});

// ✅ Exporta corretamente para Vercel
module.exports = serverless(app);
