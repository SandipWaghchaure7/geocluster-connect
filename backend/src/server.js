const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Update CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

const io = socketIo(server, {
  cors: corsOptions
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/cluster', require('./routes/clusterRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Socket.io setup (keep existing code)
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  socket.on('user_join', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
  });

  socket.on('join_group', (groupId) => {
    socket.join(groupId);
  });

  socket.on('leave_group', (groupId) => {
    socket.leave(groupId);
  });

  socket.on('send_message', (data) => {
    io.to(data.groupId).emit('receive_message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.groupId).emit('user_typing', data);
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.groupId).emit('user_stop_typing', data);
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    environment: process.env.NODE_ENV 
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});