// Simple API server to handle chat requests during development
import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Initialize dotenv
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Set up OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory rate limit storage (for development only)
const rateLimit = {};
const CHAT_DAILY_LIMIT = parseInt(process.env.CHAT_DAILY_LIMIT || '50', 10);

// CORS and parsing middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Helper functions
function getRateLimitInfo(ip) {
  // Create an anonymized hash of the IP for privacy
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
  
  // Get current day in UTC (resets at midnight UTC)
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  
  // If no entry exists, create a new one
  if (!rateLimit[ipHash] || rateLimit[ipHash].expires < Date.now()) {
    rateLimit[ipHash] = {
      count: 0,
      expires: tomorrow.getTime(),
    };
  }
  
  return rateLimit[ipHash];
}

function incrementMessageCount(ip) {
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
  const info = getRateLimitInfo(ip);
  info.count += 1;
  return info;
}

// System prompt (fallback)
const FALLBACK_SYSTEM_PROMPT = `You are Luca AI, a digital assistant in the luPS-One web application, which is a PlayStation-inspired operating system experience. Be helpful and concise in your responses.`;

// Check message quota endpoint
app.get('/api/chat/quota', (req, res) => {
  try {
    console.log('[API] Getting quota info');
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const rateLimitInfo = getRateLimitInfo(ip);
    const remaining = Math.max(0, CHAT_DAILY_LIMIT - rateLimitInfo.count);
    
    res.json({
      limit: CHAT_DAILY_LIMIT,
      used: rateLimitInfo.count,
      remaining,
      reset: new Date(rateLimitInfo.expires).toISOString(),
    });
  } catch (error) {
    console.error('Quota API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error' 
    });
  }
});

// Chat completion endpoint
app.post('/api/chat', async (req, res) => {
  try {
    console.log('[API] Received chat request');
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const rateLimitInfo = getRateLimitInfo(ip);
    
    // Check if user has reached daily limit
    if (rateLimitInfo.count >= CHAT_DAILY_LIMIT) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'You have reached your daily message limit.',
      });
    }
    
    // Parse the request body
    const { messages, body } = req.body;
    console.log('[API] Request body:', JSON.stringify({ messages, body }, null, 2));
    const processedMessages = messages || (body && body.messages) || [];
    
    // Validate messages
    if (!processedMessages || !Array.isArray(processedMessages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }
    
    // Increment message count
    incrementMessageCount(ip);
    
    // Set up response headers for Text Stream Protocol
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    
    // Create streaming response
    const apiMessages = [
      { role: 'system', content: FALLBACK_SYSTEM_PROMPT },
      ...processedMessages.map(({ role, content }) => ({
        role,
        content,
      })),
    ];
    
    // Get response from OpenAI
    const stream = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });
    
    // Stream the response using the simpler Text Stream Protocol
    // Each chunk is sent directly as plain text
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      
      if (content) {
        // Send the raw content directly (no JSON wrapper)
        res.write(content);
      }
    }
    
    // End the response
    res.end();
  } catch (error) {
    console.error('Chat API error:', error);
    
    // If headers not sent yet, return error as JSON
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error.message || 'Unknown error' 
      });
    }
    
    // If already streaming, end the response
    res.end();
  }
});

// Chat room endpoints for future implementation
app.get('/api/chat-rooms', (req, res) => {
  // Basic implementation to return empty array
  res.json({ rooms: [] });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
}); 