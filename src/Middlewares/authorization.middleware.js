// ============================> authorization.middleware <====================================

export const authariztaionMiddleware = (allowRoles) => {
  return (req, res, next) => {
    const {
      user: { role },
    } = req.gedInUesr;
    if (allowRoles.includes(role)) {
      return next();
    }
  res.status(401).json({ message: "Unauthorized" });

    
  };
};
