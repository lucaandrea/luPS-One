// We can't use fs in Edge runtime, so we need to use fetch instead
let cachedPrompt: string | null = null;

/**
 * Load the system prompt via fetch
 * Uses a cache to avoid fetching on every request
 */
export async function getSystemPrompt(): Promise<string> {
  // If we have a cached prompt, return it
  if (cachedPrompt) {
    return cachedPrompt;
  }

  try {
    // Use relative URL for edge compatibility
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    const promptUrl = `${baseUrl}/prompts/luca_system.txt`;
    
    // Fetch the system prompt
    const response = await fetch(promptUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch system prompt: ${response.status}`);
    }
    
    const prompt = await response.text();
    
    // Cache the prompt for future requests
    cachedPrompt = prompt;
    
    return prompt;
  } catch (error) {
    console.error('Error loading system prompt:', error);
    
    // Return a basic fallback prompt if fetch fails
    return "You are Luca AI, a digital assistant representing Luca Collins. Be helpful and concise in your responses. You're running in luPS-One, a PlayStation-inspired web application.";
  }
} 