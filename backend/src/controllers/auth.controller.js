import User from '../models/user.model.js';
import { signAccessToken, signRefreshToken } from '../utils/token.utils.js';
import { sendAuthCookies, clearAuthCookies} from '../utils/cookie.utils.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/AppError.utils.js';

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, className } = req.body;

  const user = await User.create({ name, email, password, className });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  sendAuthCookies(res, accessToken, refreshToken);

  res.status(201).json({
    status: 'success',
    data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  sendAuthCookies(res, accessToken, refreshToken);

  res.status(200).json({
    status: 'success',
    data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
  });
});

export const refresh = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) return next(new AppError('No refresh token', 401));

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError('User no longer exists', 401));

  const newAccessToken = signAccessToken(user._id);
  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({ status: 'success', message: 'Access token refreshed' });
});


export const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        className: req.user.className,
      },
    },
  });
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};


export const logout = catchAsync(async (req, res, next) => {
  clearAuthCookies(res);
  res.status(200).json({ status: 'success', message: 'Logged out' });
});