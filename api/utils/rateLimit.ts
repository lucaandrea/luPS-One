import { createHash } from 'crypto';

// In-memory store for rate limiting
// In a production app, you'd use Redis, DynamoDB, or another persistent store
const rateLimit: Record<string, { count: number; expires: number }> = {};

/**
 * Get rate limit information for a given IP address
 * @param ip The IP address to check
 * @returns Rate limit info including count and expiry time
 */
export async function getRateLimitInfo(ip: string) {
  // Create an anonymized hash of the IP for privacy
  const ipHash = createHash('sha256').update(ip).digest('hex');
  
  // Get current day in UTC (resets at midnight UTC)
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  
  // Clean up expired entries
  cleanupExpiredEntries();
  
  // If no entry exists, create a new one
  if (!rateLimit[ipHash] || rateLimit[ipHash].expires < Date.now()) {
    rateLimit[ipHash] = {
      count: 0,
      expires: tomorrow.getTime(),
    };
  }
  
  return rateLimit[ipHash];
}

/**
 * Increment the message count for a given IP address
 * @param ip The IP address to increment
 * @returns Updated rate limit info
 */
export async function incrementMessageCount(ip: string) {
  const ipHash = createHash('sha256').update(ip).digest('hex');
  
  // Get the current rate limit info (creates an entry if it doesn't exist)
  const info = await getRateLimitInfo(ip);
  
  // Increment the count
  info.count += 1;
  
  return info;
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  
  // Remove any entries that have expired
  Object.keys(rateLimit).forEach((key) => {
    if (rateLimit[key].expires < now) {
      delete rateLimit[key];
    }
  });
} 