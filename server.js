require('dotenv').config();
const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('\n❌  GROQ_API_KEY not found in .env');
  console.error('   Copy .env.example → .env and add your free key from https://console.groq.com/keys\n');
  process.exit(1);
}

const GROQ_MODEL          = 'llama-3.3-70b-versatile';
const MAX_TRANSCRIPT_CHARS = 6000;

function buildPrompt(transcript) {
  const text = transcript.substring(0, MAX_TRANSCRIPT_CHARS);
  return `You are a senior equity research analyst. Analyze the following earnings call transcript and extract structured intelligence. Return ONLY valid JSON — no markdown, no explanation, no preamble.

Required JSON schema:
{
  "company": {
    "name": "Full legal company name",
    "ticker": "Stock exchange and ticker (e.g. NSE: OLAELEC)",
    "sector": "Industry sector",
    "quarter": "Reporting period (e.g. Q3 FY25)"
  },
  "swot": {
    "strengths":     ["concise point", "concise point", "concise point", "concise point", "concise point"],
    "weaknesses":    ["concise point", "concise point", "concise point", "concise point"],
    "opportunities": ["concise point", "concise point", "concise point", "concise point"],
    "threats":       ["concise point", "concise point", "concise point", "concise point"]
  },
  "moat": [
    {"title": "Moat Type", "description": "1-2 sentences with evidence from transcript"},
    {"title": "Moat Type", "description": "1-2 sentences"},
    {"title": "Moat Type", "description": "1-2 sentences"}
  ],
  "tailwinds": [
    {"heading": "Factor Name", "description": "1-2 sentences on how this external factor helps the business", "impact": "HIGH or MEDIUM"},
    {"heading": "Factor Name", "description": "1-2 sentences", "impact": "HIGH or MEDIUM"},
    {"heading": "Factor Name", "description": "1-2 sentences", "impact": "HIGH or MEDIUM"}
  ],
  "headwinds": [
    {"heading": "Challenge Name", "description": "1-2 sentences on risk or challenge with evidence", "severity": "CRITICAL or HIGH or MEDIUM"},
    {"heading": "Challenge Name", "description": "1-2 sentences", "severity": "CRITICAL or HIGH or MEDIUM"},
    {"heading": "Challenge Name", "description": "1-2 sentences", "severity": "CRITICAL or HIGH or MEDIUM"}
  ],
  "verdict":     "One powerful sentence summarizing the company's investment thesis from this transcript",
  "verdictNote": "2-3 sentences elaborating on key risks and catalysts to watch"
}

Transcript:
${text}`;
}

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

app.post('/api/analyze', async (req, res) => {
  const { transcript } = req.body;

  if (!transcript || !transcript.trim()) {
    return res.status(400).json({ error: 'Transcript is required.' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model:       GROQ_MODEL,
        messages:    [{ role: 'user', content: buildPrompt(transcript) }],
        max_tokens:  2000,
        temperature: 0.3
      })
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json().catch(() => ({}));
      const msg = errData.error?.message || `Groq API error (${groqRes.status})`;
      return res.status(groqRes.status).json({ error: msg });
    }

    const data    = await groqRes.json();
    const rawText = data.choices?.[0]?.message?.content || '';
    const clean   = rawText.replace(/```json|```/g, '').trim();

    res.json(JSON.parse(clean));
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'AI returned an unexpected format. Please try again.' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅  Earnings Call Analyzer → http://localhost:${PORT}\n`);
});
