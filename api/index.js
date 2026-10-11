const express = require('express');
const app = express();

app.use(express.json());

// 1. Handshake/Validación con Meta (GET)
app.get('/api', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === 'visoro123') {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// 2. Recepción de eventos y mensajes de WhatsApp (POST)
app.post('/api', (req, res) => {
  const body = req.body;

  // Verificamos si es una notificación de WhatsApp
  if (body.object === 'whatsapp_business_account') {
    body.entry?.forEach(entry => {
      entry.changes?.forEach(change => {
        const value = change.value;
        const phoneAccountId = value.metadata?.phone_number_id; // Útil para identificar el cliente futuro

        // Si hay mensajes recibidos
        if (value.messages && value.messages[0]) {
          const message = value.messages[0];
          const from = message.from; // Número de quien envía
          const text = message.text?.body; // Texto que envió

          console.log(`[NUEVO MENSAJE] Cliente Account ID: ${phoneAccountId}`);
          console.log(`[DE]: ${from}`);
          console.log(`[TEXTO]: ${text}`);
        }
      });
    });

    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.sendStatus(404);
});

module.exports = app;
