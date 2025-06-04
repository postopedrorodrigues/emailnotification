const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

router.get('/', (req, res) => {
  res.status(200).send('Servidor funcionando na Vercel');
});

app.use('/api', router);

module.exports.handler = serverless(app);
