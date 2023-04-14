const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.set('strictQuery', false);
  try {
    // eslint-disable-next-line camelcase
    const DB_name = { dbname: 'Flow_music' };
    await mongoose.connect(process.env.MONGO_URL, DB_name, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to Database at');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
