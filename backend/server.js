const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();
const app = express();

app.use(cors({origin: "https://api-t99t.vercel.app/"}));
app.use(express.json());

mongoose
  .connect('mongodb+srv://devshashank79:UIEyAOILrJVA8mLm@cluster0.ca7oq.mongodb.net/mydb')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
