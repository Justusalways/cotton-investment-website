module.exports = (req, res, next) => {
  if (!req.session.user || req.session.user.is_admin !== 1)
    return res.status(403).send("Admin only");
  next();
};
