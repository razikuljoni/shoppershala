import logger from '#utils/logger.js';

export const validate = (schema) => {
  return (req, res, next) => {
    console.log('req ', req.body);

    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      logger.warn('Validation failed', {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        details: err.issues?.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
      res.status(400).json({
        error: 'Validation failed',
        details: err.issues?.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
  };
};
