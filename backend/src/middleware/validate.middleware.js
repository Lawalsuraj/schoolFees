import AppError from "../utils/AppError.utils.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(', ');
    return next(new AppError(message, 400));
  }

  req.body = result.data; // replace the body with the cleaned, validated version
  next();
};

export default validate;