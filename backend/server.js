import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import studentRoutes from './src/routes/student.routes.js';
import feeStructureRoutes from './src/routes/feeStructure.routes.js';
import feeRecordRoutes from './src/routes/feesRecord.routes.js';
import globalErrorHandler from './src/middleware/error.middleware.js';
import paymentRoutes from './src/routes/payment.routes.js'
import receiptRoutes from './src/routes/reciept.routes.js'

const app = express();

app.use(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' })
);

// cors
app.use(
  cors({
    origin: 'http://localhost:5173', // your Vite dev server
    credentials: true, // allows cookies to be sent/received cross-origin
  })
);

app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/fee-structures', feeStructureRoutes);
app.use('/api/v1/fee-records', feeRecordRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/receipts', receiptRoutes);

app.use(globalErrorHandler); // must be LAST — after all routes

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});