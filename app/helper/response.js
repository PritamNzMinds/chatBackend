export const sendSuccess = (res, message, data, statusCode) => {
  const response = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (res, message, error, statusCode) => {
  const response = {
    success: false,
    message,
    error,
  };
  return res.status(statusCode).json(response);
};
