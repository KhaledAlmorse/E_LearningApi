const isAuthorized = (roles) => {
  return (req, res, next) => {
    const { user } = req;
    if (!roles.includes(user.role))
      return next(new Error(`not Authorized!`, { cause: 401 }));

    return next();
  };
};

export default isAuthorized;
