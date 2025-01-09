const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1]; // Extract the token
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        const user = await User.findById(decoded?.id).select("-password"); // Fetch user and exclude sensitive data
        if (!user) {
          res.status(401);
          throw new Error("User not found");
        }
        req.user = user; // Attach user to request
        next();
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ message: "Token expired, Please Login again" });
      } else {
        res.status(401).json({ message: "Invalid token, Please Login again" });
      }
    }
  } else {
    res.status(400).json({ message: "No token provided in header" });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(403).json({ message: "User not authenticated" });
    return;
  }

  const { role } = req.user;
  if (role !== "admin") {
    res.status(403).json({ message: "Access denied: Admins only" });
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
