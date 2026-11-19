import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  className: z.string().trim().min(1, 'Class is required'),
});