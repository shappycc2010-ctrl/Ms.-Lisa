const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'dev', resave:false, saveUninitialized:true }));

app.get('/auth/url', (req, res) => {
  const redirect = process.env.REDIRECT_URI;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const scope = encodeURIComponent('openid profile email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.events.readonly');
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
  res.json({ url });
});

app.post('/auth/exchange', async (req, res) => {
  const { code } = req.body;
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams();
  params.append('code', code);
  params.append('client_id', process.env.GOOGLE_CLIENT_ID);
  params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
  params.append('redirect_uri', process.env.REDIRECT_URI);
  params.append('grant_type', 'authorization_code');

  const r = await fetch(tokenUrl, { method:'POST', body: params });
  const tokens = await r.json();
  req.session.tokens = tokens;
  res.json({ ok: true });
});

app.get('/gmail/messages', async (req, res) => {
  const tokens = req.session.tokens;
  if (!tokens) return res.status(401).json({ error: 'not authorized' });
  const r = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  });
  const data = await r.json();
  res.json(data);
});

app.listen(3000, () => console.log('Server running on :3000'));
