const connectedUsers = {};

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on("register", (userId) => {
      connectedUsers[userId] = socket.id;
      console.log(`👤 User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      Object.keys(connectedUsers).forEach((userId) => {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];
          console.log(`👋 User ${userId} disconnected`);
        }
      });
    });
  });
};

const sendNotification = (io, userId, event, data) => {
  const socketId = connectedUsers[userId]; 
  if (socketId) {
    io.to(socketId).emit(event, data);
    console.log(`📨 Notification sent to user ${userId}`);
  } else {
    console.log(`📭 User ${userId} is offline, notification saved to DB`);
  }
};

module.exports = { initSocket, sendNotification, connectedUsers };
