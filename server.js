const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/notificar-acesso', async (req, res) => {
  try {
    // Dados básicos do visitante
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Desconhecido';
    const userAgent = req.headers['user-agent'] || 'Desconhecido';
    const deviceInfo = req.body;

    // Importar node-fetch dinamicamente
    const { default: fetch } = await import('node-fetch');

    // Buscar localização aproximada via IP
    let locationData = {};
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      locationData = await response.json();
    } catch (fetchError) {
      console.error('Erro ao buscar localização:', fetchError);
    }

    // Definir valores padrão para evitar undefined
    const city = locationData.city || 'Desconhecida';
    const region = locationData.region || 'Desconhecida';
    const country = locationData.country_name || 'Desconhecida';
    const org = locationData.org || 'Desconhecida';
    const timezone = locationData.timezone || 'Desconhecido';

    // Configurar o transporte de email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.SENHA
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: 'postopedrorodrigues@gmail.com',
      subject: '🚨 Novo acesso no seu site!',
      html: `
        <h2>📡 Alerta de Acesso no Site</h2>
        <p><strong>IP:</strong> ${ip}</p>
        <p><strong>Localização:</strong> ${city}, ${region}, ${country}</p>
        <p><strong>Provedor:</strong> ${org}</p>
        <p><strong>Fuso horário:</strong> ${timezone}</p>
        <hr>
        <p><strong>Navegador (User Agent):</strong> ${userAgent}</p>
        <p><strong>Idioma:</strong> ${deviceInfo.language || 'Desconhecido'}</p>
        <p><strong>Fuso horário (navegador):</strong> ${deviceInfo.timezone || 'Desconhecido'}</p>
        <p><strong>Resolução da tela:</strong> ${deviceInfo.screen?.width ? `${deviceInfo.screen.width}x${deviceInfo.screen.height}` : 'Desconhecida'}</p>
        <p><strong>Plataforma:</strong> ${deviceInfo.platform || 'Desconhecida'}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email enviado!' });
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    res.status(500).json({ error: 'Erro ao enviar email' });
  }
});

// Exportar o app para Vercel
module.exports = app;