import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.warn('WARNING: OPENAI_API_KEY is not set. Set it in your environment before starting the server.');
}
const client = new OpenAI({ apiKey: openaiApiKey });

// simple health route
app.get('/', (req, res) => {
  res.send('Ms. Lisa GPT backend is online ✅');
});

// Chat endpoint - expects { message: "text" }
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Please send { message: "your text" } in JSON body.' });
    }

    // Minimal system prompt to make Lisa behave as Shappy's charming secretary
    const systemPrompt = `You are Ms. Lisa, a charming, intelligent personal and work assistant for Shappy (also called Bolu).
You always address him respectfully as "Shappy" or "Bolu". Keep replies concise, helpful, and occasionally playful when appropriate.
Follow his rules: do not initiate any transaction, ask for confirmation for sensitive actions, and prioritize privacy.
When you don't know something, ask a clarifying question.`;

    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.2
    });

    const reply = resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content
      ? resp.choices[0].message.content
      : 'Sorry, I could not generate a reply right now.';

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message || err.toString() });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Ms. Lisa GPT backend listening on port ${PORT}`);
});
