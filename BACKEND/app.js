// app.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect DB
connectDB();

// Init app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use((req, res, next) => {
  console.log('🌐 Incoming:', req.method, req.path);
  next();
});
app.use('/api/gps', require('./routes/gps.routes'));
app.use('/api/fuel', require('./routes/fuel.routes'));
app.use('/api/driver', require('./routes/driver.routes'));
app.use('/api/alerts', require('./routes/alerts.routes'));
app.use('/api/routes', require('./routes/routes.routes'));
app.use('/api/chat', require('./routes/chatbot.routes'));
app.use('/api/trucks', require('./routes/trucks.routes'));
app.use('/api/auth', require('./routes/auth.routes')); // ✅ Inline require — no need for separate const
app.use('/api/test', require('./routes/test.routes'));

// Test route
app.get('/api/gps/test', (req, res) => {
  res.json({ message: 'GPS route is working!' });
});

// Root route
app.get('/', (req, res) => {
  res.send('<h1>Monitruck Backend Running ✅</h1>');
});

// Error handler
app.use(require('./utils/errorHandler'));

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('📱 Client connected');

  socket.on('disconnect', () => {
    console.log('📱 Client disconnected');
  });
});

// Emit alerts to frontend
const Alert = require('./models/Alert');
Alert.watch().on('change', (data) => {
  if (data.operationType === 'insert') {
    io.emit('alert', data.fullDocument);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = { app, io };