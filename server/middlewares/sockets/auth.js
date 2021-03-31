const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const authorize = (socket, next) => {
  const token = socket.request.headers.cookie
    ? cookie.parse(socket.request.headers.cookie).token
    : undefined;
  if (!token) {
    socket.request.error = "No token. Authorization denied.";
    next();
    return;
  }
  try {
    const userObj = jwt.verify(token, process.env.JWT_SECRET);
    socket.request.user = userObj;
  } catch (error) {
    console.error(error);
    socket.request.error = "Token is not valid";
  }
  next();
};

module.exports = authorize;
