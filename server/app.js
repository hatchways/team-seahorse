const createError = require("http-errors");
const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");
const userRouter = require("./routes/user");
const listsRouter = require("./routes/lists");
const productsRouter = require("./routes/products");
const imageUploadRouter = require("./routes/imageUpload");
const followRouter = require("./routes/follower");
const authorizeSocket = require("./middlewares/sockets/auth");

const { json, urlencoded } = express;

//for testing db connection
const sequelize = require("./models");
//synchronizes models
require("./models/models");

var app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/ping", pingRouter);
app.use("/user", userRouter);
app.use("/lists", listsRouter);
app.use("/products", productsRouter);
app.use("/upload-image", imageUploadRouter);
app.use("/followers", followRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

//userSockets relates user ids to an array of open socket connections.
//NOTE: userSockets initialization might need to be moved later. I can see it being partially applied to some functions
//before they get passed off to others. -Trevor
//NOTE: I'm kind of worried that there isn't really a way of locking this right now, which is problematic since
//connections can really be added whenever. -Trevor
const userSockets = {
  connections: {},
  addConnection: function (socket) {
    if (socket.req.user.id in this.connections) {
      this.connections[socket.req.user.id].push(socket);
    } else this.connections[socket.req.user.id] = [socket];
  },
};

//Sets up websocket server.
const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
  cors: {
    origin: [process.env.FRONTEND_DOMAIN],
  },
  cookie: {
    name: "token",
  },
});
io.use(authorizeSocket);
io.on("connection", (socket) => {
  //Turns back user if they failed authorization.
  if ("error" in socket.request) {
    socket.emit("error", { msg: socket.request.error });
    socket.disconnect(true);
    return;
  }
  userSockets.addConnection(socket);
});
httpServer.listen(3002);

module.exports = app;
