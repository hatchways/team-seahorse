const authorize = (socket, next) => {
  if (!("auth" in socket.handshake) || !("token" in socket.handshake.auth)) {
    socket.request.error = "No token. Authorization denied.";
    next();
    return;
  }
  try {
    const userObj = jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET
    );
    socket.request.user = userObj;
  } catch (error) {
    console.error(error);
    socket.request.error = "Token is not valid";
  }
  next();
};

module.exports = authorize;
