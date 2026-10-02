const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Mongo duplicate key error globally
  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = 'Duplicate field value — this record already exists';
  }

  // Handle Mongoose validation errors globally
  if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default globalErrorHandler;