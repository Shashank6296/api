const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();
const app = express();

// Dynamic CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://api-t99t.vercel.app",
      "https://testapi-k73l.vercel.app", // Add more origins as needed
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // If using cookies
};

app.use(cors(corsOptions));
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});

mongoose
  .connect(process.env.MONGO_URI) // Use environment variable for MongoDB URI
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
