module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== "technician") {
      return res.status(403).json({ message: "Access denied. Technicians only." });
    }
    next();
  };
  