require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ message: 'MealBridge API is running' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
if (require.main === module) {
  connectDatabase()
    .then(() => app.listen(port, () => console.log(`MealBridge API listening on port ${port}`)))
    .catch((error) => { console.error(`Database connection failed: ${error.message}`); process.exit(1); });
}

module.exports = app;
