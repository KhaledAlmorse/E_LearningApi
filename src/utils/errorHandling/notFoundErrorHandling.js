export const notFoundErrorHandling = (req, res, next) => {
  res.status(404).json({
    message: "Endpoint Not Found ",
  });
};
