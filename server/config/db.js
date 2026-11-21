const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pm_internship';
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      return;
    } catch (err) {
      retries += 1;
      console.error(`[Database] Connection attempt ${retries} failed: ${err.message}`);
      if (retries >= maxRetries) {
        console.error('[Database] Max connection retries reached. Exiting process.');
        process.exit(1);
      }
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

module.exports = connectDB;
