const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const AdminRoutes = require('./routes/adminRoutes');
// const uploadRoutes = require('./routes/trackRoutes');
const ArtistRoutes = require('./routes/artistRoutes');
const UserRoutes = require('./routes/userRoutes');
const Database = require('./config/config');

dotenv.config();
const app = express();

// database
Database();

app.use(
  cors({
    // origin: ['https://bespoke-lolly-c2ab39.netlify.app'],
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/', UserRoutes);
app.use('/admin', AdminRoutes);
app.use('/artist', ArtistRoutes);

// port
app.listen(process.env.PORT, () => {
  console.log('Server running on port', process.env.PORT);
});

module.exports = app;
