const express = require('express');
const app = express();

app.use(express.json());

// Validacion con Meta (GET)
app.get('/api', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === 'visoro123') {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Recepcion de mensajes de WhatsApp (POST)
app.post('/api', (req, res) => {
  console.log('Mensaje recibido:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

module.exports = app;
