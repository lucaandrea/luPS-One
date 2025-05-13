import { OpenAI } from 'openai';
import { getSystemPrompt } from '../utils/getSystemPrompt';
import { getRateLimitInfo, incrementMessageCount } from '../utils/rateLimit';
import { ChatCompletionMessageParam } from 'openai/resources';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Daily message limit per user
const CHAT_DAILY_LIMIT = parseInt(process.env.CHAT_DAILY_LIMIT || '20', 10);

// Allow streaming responses up to 60 seconds
export const maxDuration = 80;
export const runtime = "edge";
export const edge = true;
export const stream = true;
export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  // Only allow POST method and handle OPTIONS for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400', // 24 hours
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }

  try {
    // Get IP address for rate limiting (adapted to work with Request object)
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitInfo = await getRateLimitInfo(ip);
    
    // Check if user has reached daily limit
    if (rateLimitInfo.count >= CHAT_DAILY_LIMIT) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'You have reached your daily message limit.',
        }),
        {
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        }
      );
    }

    // Parse the request body
    const requestData = await req.json();
    const { messages, body } = requestData;
    
    const processedMessages = messages || (body && body.messages) || [];

    // Validate messages
    if (!processedMessages || !Array.isArray(processedMessages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    // Get system prompt
    const systemPrompt = await getSystemPrompt();
    
    // Prepare messages for OpenAI with proper typing
    const apiMessages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...processedMessages.map(({ role, content }: { role: string; content: string }) => ({
        role: role as 'user' | 'assistant' | 'system',
        content,
      })),
    ];

    // Increment message count
    await incrementMessageCount(ip);

    // Create streaming response
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use the most cost-effective 4-series model
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    // Return streaming response
    return new Response(
      new ReadableStream({
        async start(controller) {
          // Stream the response in the format expected by the Vercel AI SDK
          const encoder = new TextEncoder();
          
          for await (const chunk of response) {
            const delta = chunk.choices[0]?.delta;
            const content = delta?.content || '';
            
            if (content) {
              // Format for Vercel AI SDK
              const data = JSON.stringify({ 
                id: chunk.id, 
                object: 'chat.completion.chunk',
                choices: [{ 
                  index: 0, 
                  delta: { content }, 
                  finish_reason: null 
                }]
              });
              
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
            
            if (chunk.choices[0]?.finish_reason !== null) {
              // Send the [DONE] message when finished
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            }
          }
          
          controller.close();
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'X-Accel-Buffering': 'no',
        },
      }
    );
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
} 