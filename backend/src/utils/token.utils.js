
import jwt from 'jsonwebtoken';

export const signAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

export const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};