const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_END, // Replace with your frontend origin in production
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB connection
mongoose.connect(MONGO_URI, { autoIndex: true })
  .then(() => {
    console.log('MongoDB Connected');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
  });


// Socket.IO Real-Time Logic
const docPresenceMap = new Map();    // docId => Map<userId, userInfo>
const socketUserMap = new Map();     // socketId => { docId, user }

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join-doc", ({ docId, user }) => {
    if (!docId || !user?.id) return;

    socket.join(docId);
    socketUserMap.set(socket.id, { docId, user });

    if (!docPresenceMap.has(docId)) {
      docPresenceMap.set(docId, new Map());
    }

    const userMap = docPresenceMap.get(docId);
    userMap.set(user.id, {
      id: user.id,
      name: user.fullName,
      avatar: user.avatar,
    });

    io.to(docId).emit("presence-update", Array.from(userMap.values()));
    console.log(`${user.fullName} joined document: ${docId}`);
  });

  socket.on("send-changes", ({ docId, delta }) => {
    if (docId && delta) {
      socket.to(docId).emit("receive-changes", delta);
    }
  });

  socket.on("leave-doc", ({ docId, user }) => {
    if (!docId || !user?.id) return;

    socket.leave(docId);

    const userMap = docPresenceMap.get(docId);
    if (userMap) {
      userMap.delete(user.id);
      if (userMap.size === 0) {
        docPresenceMap.delete(docId);
      } else {
        io.to(docId).emit("presence-update", Array.from(userMap.values()));
      }
    }

    socketUserMap.delete(socket.id);
    console.log(`${user.fullName} left document: ${docId}`);
  });

  socket.on("disconnect", () => {
    const session = socketUserMap.get(socket.id);
    if (session) {
      const { docId, user } = session;
      const userMap = docPresenceMap.get(docId);

      if (userMap) {
        userMap.delete(user.id);
        if (userMap.size === 0) {
          docPresenceMap.delete(docId);
        } else {
          io.to(docId).emit("presence-update", Array.from(userMap.values()));
        }

        console.log(`${user.fullName} disconnected from document: ${docId}`);
      }

      socketUserMap.delete(socket.id);
    }

    console.log(`Socket disconnected: ${socket.id}`);
  });
});

global.io = io;
