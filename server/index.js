const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post('/api/generate', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const prompt = `
      You are an expert podcast producer and scriptwriter for a show called "The Global Daily".
      Your hosts are:
      1. **Rohan** (Host A): British-Indian (grew up in UK). Witty, slightly cynical, loves structure and facts. Uses British slang (mate, bloody, cheers) but with subtle Indian cultural references.
      2. **Mei** (Host B): Singaporean, global citizen. High energy, optimistic, curious, loves food and travel hacks. Uses "lah", "leh" occasionally, and speaks with a fast, punchy rhythm.

      **Task**:
      Research and write a podcast script about: "${topic}".
      
      You must find and include 3 specific stories/segments:
      1. **Mainstream Story**: Serious implications or major news related to the topic.
      2. **Light-hearted Story**: Fun, weird, or life-hack related (e.g., student hacks, cooking, sports).
      3. **Travel/Sports Story**: A mix of culture/lifestyle.

      **Format**:
      - Use [SFX: <sound>] for sound effects.
      - Use **Rohan:** and **Mei:** for dialogue.
      - Keep it engaging, conversational, and natural.
      - Start with a catchy intro and end with a sign-off.
      - Total length: ~800-1000 words.

      **Important**:
      - You have access to real-time information. Please use up-to-date stories if possible.
      - DO NOT make up fake news; use real examples/anecdotes where appropriate.
    `;

        const response = await axios.post(
            'https://api.perplexity.ai/chat/completions',
            {
                model: 'sonar', // Switched to sonar for faster generation.
                messages: [
                    { role: 'system', content: 'You are a helpful and creative podcast script writer. Do not show your reasoning steps, just the final script.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 3000,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 120000 // 2 minute timeout
            }
        );

        const script = response.data.choices[0].message.content;

        // Extract citations if available (Perplexity usually returns them in the response object, but sometimes in text)
        // For now, we just return the script.

        res.json({ script });

    } catch (error) {
        console.error('Error generating script:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate script' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
