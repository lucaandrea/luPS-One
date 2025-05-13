import { getRateLimitInfo } from '../utils/rateLimit';

// Daily message limit per user
const CHAT_DAILY_LIMIT = parseInt(process.env.CHAT_DAILY_LIMIT || '20', 10);

// Allow responses up to 60 seconds
export const maxDuration = 60;
export const runtime = "edge";
export const edge = true;
export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  // Only allow GET method
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400', // 24 hours
      }
    });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }

  try {
    // Get IP address for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Get rate limit info for this user
    const rateLimitInfo = await getRateLimitInfo(ip);
    
    // Calculate remaining messages
    const remaining = Math.max(0, CHAT_DAILY_LIMIT - rateLimitInfo.count);
    
    // Format the expiration time as an ISO string for better compatibility
    const resetTime = new Date(rateLimitInfo.expires).toISOString();
    
    // Return quota information
    return new Response(
      JSON.stringify({
        limit: CHAT_DAILY_LIMIT,
        used: rateLimitInfo.count,
        remaining,
        reset: resetTime,
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0'
        },
      }
    );
  } catch (error) {
    console.error('Quota API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
} 