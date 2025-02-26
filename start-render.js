// This file is specifically for Render deployment
const { startServer } = require('./server');

// Get PORT from environment variable
const PORT = process.env.PORT || 3000;

// Start the server
const server = startServer(PORT);

// Log successful start
console.log(`Server started on PORT ${PORT}`);
console.log('Environment:', process.env.NODE_ENV || 'production');

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
