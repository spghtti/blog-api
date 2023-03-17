function verifyAdmin(req, res, next) {
  if (req.user.isAdmin === null || req.user.isAdmin !== true) {
    res.sendStatus(403);
  } else {
    next();
  }
}

module.exports = verifyAdmin;
