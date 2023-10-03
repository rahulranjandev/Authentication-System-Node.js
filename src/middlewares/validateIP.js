const validateIP = (req, res, next) => {
  const ip = req.ip;

  if (!ip || ip === undefined || ip === null) {
    return res.status(400).json({
      message: `something went wrong, please try again!`,
    });
  }

  return next();
};

export default validateIP;
