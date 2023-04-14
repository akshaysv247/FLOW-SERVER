/* eslint-disable no-else-return */
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ArtistModel = require('../model/artistModel');

module.exports = {

  // eslint-disable-next-line consistent-return
  artistSignup: async (req, res) => {
    try {
      const {
        name, email, phone, password,
      } = req.body;
      if (name && email && phone && password) {
        if (!validator.isEmail(email)) {
          return res.status(400).send({ message: 'Invalid email', success: false });
        }
        if (!validator.isStrongPassword(password)) {
          return res
            .status(400)
            .send({ message: 'Invalid password please check your password', success: false });
        }
        // eslint-disable-next-line object-shorthand
        const existArtist = await ArtistModel.findOne({ email: email });
        if (existArtist) {
          return res
            .status(400)
            .send({ message: 'Artist already exists', success: false });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password.trim(), salt);
          const newArtist = new ArtistModel({
            name,
            email,
            phone,
            password: hashedPassword,
          });
          await newArtist.save();
          return res
            .status(200)
            .send({ message: 'Signed in successfully', success: true });
        }
      } else {
        return res.status(400).send({ message: 'Please fill all the required fields', success: false });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: `artistSignup ${error.message}`, success: false });
    }
  },
  // eslint-disable-next-line consistent-return
  artistLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const artist = await ArtistModel.findOne({ email });
        if (artist) {
          // console.log(artist);
          const isMatch = await bcrypt.compare(password, artist.password);
          if (artist.isBlocked) {
            return res
              .status(200)
              .send({ message: 'You can not access this page', success: false });
          }
          if (isMatch) {
            // eslint-disable-next-line no-underscore-dangle
            const token = jwt.sign({ id: artist._id }, process.env.JWT_SECRET, {
              expiresIn: '1d',
            });
            return res
              .status(201).send({
                message: 'Login successful', success: true, token, artist,
              });
          }
          return res.status(400).send({ message: 'Please enter the correct password', success: false });
        }
        return res
          .status(400)
          .send({ message: 'Artist not found', success: false });
      }
      return res.status(200).send({ message: 'Please fill all the required fields', success: false });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: `artistLogin ${error.message}`, success: false });
    }
  },
};
