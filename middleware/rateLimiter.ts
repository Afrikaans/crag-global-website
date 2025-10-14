import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// 5 failed logins per 15 min → block IP completely
export const authLimiter = rateLimit({
  store: new RedisStore({ client: redis, prefix: 'rl:auth:' }),
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    redis.setex(`block:${_req.ip}`, 30 * 60, '1');   // 30 min block
    res.status(429).json({ message: 'Too many attempts, IP blocked 30 min' });
  },
});

// Global limit for other routes
export const globalLimiter = rateLimit({
  store: new RedisStore({ client: redis, prefix: 'rl:global:' }),
  windowMs: 60 * 1000,
  max: 200,
});

// Middleware to check if IP is currently blocked
export const checkIPBlocked = async (req: any, res: any, next: any) => {
  const blocked = await redis.get(`block:${req.ip}`);
  if (blocked) return res.status(403).json({ message: 'IP blocked' });
  next();
};
