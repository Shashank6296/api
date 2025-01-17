const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();
const app = express();

app.use(cors({ origin: "https://api-1-lemt.onrender.com" }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, )
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
