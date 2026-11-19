import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 attempts per IP in that window
  message: {
    status: 'fail',
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
});