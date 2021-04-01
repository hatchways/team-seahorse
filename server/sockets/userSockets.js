//userSockets relates user ids to an array of open socket connections.
//NOTE: userSockets initialization might need to be moved later. I can see it being partially applied to some functions
//before they get passed off to others. -Trevor
//NOTE: I'm kind of worried that there isn't really a way of locking this right now, which is problematic since
//connections can really be added whenever. -Trevor
const userSockets = {
  connections: {},
  addConnection: function (socket) {
    const userId = socket.request.user.id;
    if (userId in this.connections) {
      this.connections[userId].push(socket);
    } else this.connections[userId] = [socket];
  },
  removeConnection: function (socket) {
    const userId = socket.request.user.id;
    const connections = this.connections[userId];
    connections.splice(connections.indexOf(socket), 1);
    if (connections.length == 0) delete this.connections[userId];
  },
};

module.exports = userSockets;
