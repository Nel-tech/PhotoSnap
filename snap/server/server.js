const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// Load environment variables
dotenv.config({ path: './.env' });
// Connect to local MongoDB
  const DB = process.env.DATABASE_CONNECTION;
  // const DB = process.env.DATABASE_LOCAL

mongoose
  .connect(DB)
  .then(() => console.log('✅ Local MongoDB connected successfully!'))
  .catch((err) => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });

// Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

// Handle unexpected shutdowns
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION:', err.name, err.message);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => console.log('💤 Server closed.'));
});
