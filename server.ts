import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Lazy initializer for the Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured in the Secrets panel.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ---------------------- API ROUTES ----------------------

// 1. AI Text Generator
app.post('/api/tools/generate-text', async (req, res) => {
  const { prompt, tone, format, length } = req.body;

  try {
    const ai = getGeminiClient();
    
    const promptText = `You are a professional content editor. Write a piece based on this request.
Topic/Prompt: "${prompt}"
Tone: ${tone}
Format: ${format}
Word Length Target: Approximately ${length} words.

Guidelines:
- Write the output directly in clean Markdown format.
- Do NOT include any chatty introductory text or post-generation meta commentaries (such as "Here is your article:").
- Strictly output the generated article/email/caption content itself.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
    });

    res.json({ result: response.text });
  } catch (err: any) {
    console.error('Text Generation Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate text content.' });
  }
});

// 2. AI Image Generator
app.post('/api/tools/generate-image', async (req, res) => {
  const { prompt, aspectRatio } = req.body;

  try {
    const ai = getGeminiClient();

    // Map React ratios to Google Image generation ratios
    const validRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const ratioToUse = validRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: ratioToUse,
        },
      },
    });

    let base64String = '';
    
    // Search candidates parts for inlineData containing the image bytes
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          base64String = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64String) {
      throw new Error('Image parts were empty in model response. Please simplify the description or try again.');
    }

    res.json({ imageUrl: `data:image/png;base64,${base64String}` });
  } catch (err: any) {
    console.error('Image Generation Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate image asset.' });
  }
});

// 3. AI Paraphraser
app.post('/api/tools/paraphrase', async (req, res) => {
  const { text, tone, lengthMode } = req.body;

  try {
    const ai = getGeminiClient();

    let lengthInstruction = 'Keep the rewritten content approximately the same length as the original.';
    if (lengthMode === 'shorten') {
      lengthInstruction = 'Significantly shorten and condense the text, focusing only on the core message.';
    } else if (lengthMode === 'expand') {
      lengthInstruction = 'Elaborate on the concepts, adding rich vocabulary and detailed descriptions to expand the text.';
    }

    const promptText = `You are a master paraphrasing engine. Rewrite and improve the following original text.
Original text:
"""
${text}
"""

Instructions:
- Tone target: ${tone}
- Length regulation: ${lengthInstruction}
- Improve clarity, fix clumsy phrasing, and ensure proper sentence structures.
- Return ONLY the rewritten text itself. No intros, no outlines, no explanations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
    });

    res.json({ result: response.text });
  } catch (err: any) {
    console.error('Paraphraser Error:', err);
    res.status(500).json({ error: err.message || 'Failed to paraphrase draft.' });
  }
});

// 4. AI Summarizer
app.post('/api/tools/summarize', async (req, res) => {
  const { text, mode } = req.body;

  try {
    const ai = getGeminiClient();

    let formatInstruction = '';
    if (mode === 'bullets') {
      formatInstruction = 'Provide a structured, clean list of bullet points detailing primary events and factual assertions.';
    } else if (mode === 'executive') {
      formatInstruction = 'Provide a single cohesive, high-level executive summary paragraph.';
    } else if (mode === 'takeaways') {
      formatInstruction = 'Provide a numbered list of the top core actionable insights or takeaways from this text.';
    } else {
      formatInstruction = 'Provide an ultra-brief, one-sentence high-level summary of the entire document.';
    }

    const promptText = `You are an expert editor. Summarize the following document.
Document:
"""
${text}
"""

Instructions:
- Summary format: ${formatInstruction}
- Do NOT provide introductory chatter. Write only the summary itself.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
    });

    res.json({ result: response.text });
  } catch (err: any) {
    console.error('Summarization Error:', err);
    res.status(500).json({ error: err.message || 'Failed to summarize content.' });
  }
});

// 5. AI Chatbot
app.post('/api/tools/chat', async (req, res) => {
  const { history } = req.body;

  try {
    const ai = getGeminiClient();

    // Map conversation array to the SDK content schema
    const contents = history.map((h: any) => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction: 'You are a general-purpose helpful AI assistant. Answer the user comprehensively but concisely, keeping formatting clean with Markdown.',
      }
    });

    res.json({ result: response.text });
  } catch (err: any) {
    console.error('Chatbot Error:', err);
    res.status(500).json({ error: err.message || 'Failed to process chat message.' });
  }
});


// ---------------------- VITE / STATIC SERVING ----------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development mode: load Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve static prebuilt assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
