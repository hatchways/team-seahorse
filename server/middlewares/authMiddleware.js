const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) { 
    res.status(401).send({
      msg: "No token. Authorization denied.",
    });
  }

  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
