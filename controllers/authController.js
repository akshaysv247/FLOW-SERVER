/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable no-else-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { UserModel } = require('../model/userModel');
const artistModel = require('../model/artistModel');

module.exports = {
  // Sign up User
  userSignup: async (req, res) => {
    try {
      // eslint-disable-next-line object-curly-newline
      const { name, email, phone, password } = req.body;
      if (name && email && phone && password) {
        if (validator.isEmail(email) === false) {
          return res
            .status(200)
            .send({ message: 'Email is not valid', success: false });
        }
        if (validator.isStrongPassword(password) === false) {
          return res
            .status(200)
            .send({ message: 'Password is not Strong', success: false });
        }
        const existUser = await UserModel.findOne({ email: email });
        if (existUser) {
          return res
            .status(200)
            .send({ message: 'User is already exist', sucess: false });
        } else {
          const salt = await bcrypt.genSaltSync(10);
          const hashedPassword = await bcrypt.hash(password.trim(), salt);
          const newUser = new UserModel({
            name,
            email,
            phone,
            password: hashedPassword,
          });
          await newUser.save();
          res
            .status(200)
            .send({ message: 'Sign up successfully', success: true });
        }
      } else {
        return res
          .status(400)
          .send({ message: 'All fields must be filled', success: false });
      }
    } catch (error) {
      res.status(500).send({ message: `userSignup ${error.message}` });
    }
    return null;
  },
  // userSign in
  userLogin: async (req, res) => {
    try {
      if (!req.body) {
        return res
          .status(200)
          .send({ message: 'please fill out the fields', success: false });
      }
      const user = await UserModel.findOne({ email: req.body.email });
      // console.log(user);
      if (!user) {
        return res
          .status(200)
          .send({ message: 'User does not exist', success: false });
      }
      if (user.isBlocked) {
        return res
          .status(200)
          .send({ message: 'You can not access this page', success: false });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (isMatch) {
        // eslint-disable-next-line no-underscore-dangle
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });
        res
          .status(201)
          // eslint-disable-next-line object-curly-newline
          .send({ message: 'Login Successful', success: true, token, user });
      } else {
        return res
          .status(200)
          .send({ message: 'Password is incorrect', success: false });
      }
    } catch (error) {
      // console.log(error);
      res
        .status(500)
        .send({ message: 'Error while Login ', success: false, error });
    }
    return null;
  },
  // eslint-disable-next-line consistent-return
  adminLogin: async (req, res) => {
    console.log(req.body);
    try {
      if (req.body) {
        const Admin = await UserModel.findOne({ email: req.body.email });
        const isMatch = await bcrypt.compare(req.body.password, Admin.password);
        console.log(isMatch);
        if (Admin.isAdmin === true) {
          if (isMatch) {
            console.log('to');
            const token = jwt.sign(
              // eslint-disable-next-line no-underscore-dangle
              { id: Admin._id },
              process.env.JWT_SECRET,
              { expiresIn: '1d' },
            );
            console.log('damn');
            res.status(200)
              .send({
                message: 'Login successful',
                success: true,
                token,
                Admin,
              });
          } else {
            return res.status(200).send({ message: 'Invalid Password', success: false });
          }
        } else {
          return res
            .status(400)
            .send({ message: 'Admin not found', success: false });
        }
      } else {
        return res
          .status(400)
          .send({ message: 'please fill all the fields', success: false });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: 'Server error', success: false });
    }
  },
  resetPassword: async (req, res) => {
    const { password } = req.body.datas;
    const { role, email } = req.body;
    try {
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password.trim(), salt);
      if (role === 'fan') {
        console.log(password, role, email);
        const user = await UserModel.findOneAndUpdate({ email: email }, {
          $set: { password: hashedPassword },
        });
        if (user) {
          console.log('resetted', user);
          return res.json({ message: 'Your password has been updated', success: true });
        } else {
          return res.json({ message: 'Invalid User', success: false });
        }
      } else {
        console.log('diff role');
        const artist = await artistModel.findOneAndUpdate({ email: email }, {
          $set: { password: hashedPassword },
        });
        console.log(artist, 'reset');
        if (artist) {
          return res.json({ message: 'Your password has been updated', success: true });
        } else {
          return res.json({ message: 'Invalid artist', success: false });
        }
      }
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  },
  validateUser: async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const user = await UserModel.findOne({ _id: id });
      console.log(user);
      if (user.isBlocked === true) {
        return res.json({ success: false, message: 'You are not allowed to access this page anymore.' });
      } else {
        return res.json({ success: true, message: 'You are allowed to access this page ' });
      }
    } catch (error) {
      return res.json({ success: false, message: 'Error occured' });
    }
  },
};
