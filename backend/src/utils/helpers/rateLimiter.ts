const rateLimitCache: {
  [key: number]: number;
} = {};

export const RATE_LIMIT_WINDOW = 60 * 1000; // 60 seconds

export function rateLimiter(userId: number) {
  const currentTime = Date.now();
  if (!rateLimitCache[userId]) {
    rateLimitCache[userId] = currentTime;
    return true;
  }

  const userData = rateLimitCache[userId];

  //blocking request when req come again under 1 second
  if (currentTime - userData < RATE_LIMIT_WINDOW) {
    return false;
  }

  rateLimitCache[userId] = currentTime;
  return true;
}

export function removeUserFromCache(userId: number) {
  delete rateLimitCache[userId];
}

// cleanup function to clean old request
setInterval(() => {
  const currentTime = Date.now();
  for (const userId in rateLimitCache) {
    if (currentTime - rateLimitCache[userId] > RATE_LIMIT_WINDOW) {
      delete rateLimitCache[userId];
    }
  }
}, RATE_LIMIT_WINDOW);
