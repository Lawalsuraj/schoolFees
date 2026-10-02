const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // any error gets passed to globalErrorHandler
  };
};

export default catchAsync;
