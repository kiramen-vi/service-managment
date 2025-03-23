const adminMiddleware = (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
  
    // Check if user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  
    // User is an admin, proceed to the next middleware or route
    next();
  };
  
  module.exports = adminMiddleware;
  