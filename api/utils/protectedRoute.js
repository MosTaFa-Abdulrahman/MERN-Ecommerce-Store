const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Verify Token
// const verifyToken = async (req, res, next) => {
//   try {
//     const token = req.cookies.access_token;
//     if (!token) return res.status(401).json({ message: "Unauthorized 😌" });

//     jwt.verify(token, process.env.JWT_SEC, (err, user) => {
//       if (err) return res.status(403).json("Token is not valid ~!");
//       req.user = user;
//       next();
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: "Unauthorized 😌" });

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    const user = await User.findById(decoded.userId).select("-password");

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify User
const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) next();
    else return res.status(403).json("You are not authorized (User) ~!");
  });
};

// Verify Admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) next();
    else return res.status(403).json("You are not authorized (Admin) ~!");
  });
};

module.exports = { verifyToken, verifyUser, verifyAdmin };
