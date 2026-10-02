import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log('Admin already exists');
    process.exit();
  }

  await User.create({
    name: 'Super Admin',
    email: 'admin@gmail.com',
    password: '123456',
    role: 'admin',
  });

  console.log('Admin created');
  process.exit();
};

seedAdmin();