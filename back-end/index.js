const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with frontend domain
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
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


  
// Socket.IO logic
const docPresenceMap = new Map(); // Tracks presence per docId

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a document room and announce presence
  socket.on("join-doc", ({ docId, user }) => {
    if (!docId || !user?.id) return;

    socket.join(docId);

    // Initialize room if not exists
    if (!docPresenceMap.has(docId)) {
      docPresenceMap.set(docId, new Set());
    }

    const userInfo = JSON.stringify({
      id: user.id,
      name: user.fullName,
      avatar: user.avatar,
    });

    docPresenceMap.get(docId).add(userInfo);

    // Emit updated presence list
    const usersInRoom = Array.from(docPresenceMap.get(docId)).map(JSON.parse);
    io.to(docId).emit("presence-update", usersInRoom);

    console.log(`${user.fullName} joined document: ${docId}`);
  });

  // Broadcast content changes to other users
  socket.on("send-changes", ({ docId, delta }) => {
    if (docId && delta) {
      socket.to(docId).emit("receive-changes", delta);
    }
  });

  // Leave document room and update presence
  socket.on("leave-doc", ({ docId, user }) => {
    if (!docId || !user?.id) return;

    socket.leave(docId);

    const userInfo = JSON.stringify({
      id: user.id,
      name: user.fullName,
      avatar: user.avatar,
    });

    const userSet = docPresenceMap.get(docId);
    if (userSet) {
      userSet.delete(userInfo);

      if (userSet.size === 0) {
        docPresenceMap.delete(docId);
      } else {
        docPresenceMap.set(docId, userSet);
      }

      const usersInRoom = Array.from(userSet).map(JSON.parse);
      io.to(docId).emit("presence-update", usersInRoom);
    }

    console.log(`${user.fullName} left document: ${docId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // Optional: implement cleanup if tracking users per socket
  });
});

global.io = io;
