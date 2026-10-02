import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'You are not logged in' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'User no longer exists' });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired access token' });
  }
};

