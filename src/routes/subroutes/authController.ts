import express, {Express} from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {User} from '../../model/user';
import {
  isValidPassword,
  isValidAuthQuery,
  isValidEmail} from '../../utils/authUtils';
import jwt from 'jsonwebtoken';

dotenv.config();

// set variables
const authController: Express = express();
const saltRound = 10;
const dbPath = process.env.MONGO_DB_URL;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// connect to mongo db
mongoose.connect(dbPath);


authController.use(bodyParser.json());

// http request for login
authController.post('/v1/login', async (req, res) => {
  const {email, password} = req.body;

  // check email/password format is correct
  if (!isValidAuthQuery(email, password)) {
    return res
        .status(200)
        .json({status: 'error', error: 'Invalid username/password'});
  }

  // try get user collection from db
  // if found, return refresh/access tokens with id
  try {
    const user = await User.findByCredentials(email, password);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    const isPasswordMatched = await user.checkPassword(password);

    if (isPasswordMatched) {
      return res.json(
          {
            status: 'ok',
            error: null,
            data: {
              id: user._id.toString(),
            },
            refreshToken,
            accessToken,
          });
    }
  } catch (error) { // if error occurs, send error with 400
    return res.status(400).json({status: 'error', error});
  }
});

// handle http request for sign up
authController.post('/v1/register', async (req, res) => {
  const {email, password, firstName, lastName} = req.body;

  // check email/password format is correct
  if (!isValidAuthQuery(email, password)) {
    return res.status(400)
        .json({status: 'error', error: 'Invalid username/password'});
  }

  // hash password to persist in db
  const hashedPassword = await bcrypt.hash(password, saltRound);
  const username = email.toLowerCase();

  // try new user collection with given information
  try {
    const user = await User.create({
      username: username,
      password: hashedPassword,
      firstName,
      lastName,
    });
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    return res
        .status(400)
        .json(
            {
              status: 'ok',
              data: {id: user._id.toString()},
              refreshToken,
              accessToken,
            });
  } catch (error) {
    if ((error as {code: number}).code === 11000) {
      return res.status(400).json(
          {status: 'error', code: 409, error: 'Username already in use'});
    } else {
      return res.status(400).json({status: 'error', error});
    }
  }
});

// delete user information
authController.delete('/v1/unregister', async (req, res) => {
  const {email, password} = req.body;
  const token = req.headers['authorization'];

  // check email & password are valid
  if (!isValidAuthQuery(email, password)) {
    return res.json({status: 'error', error: 'Invalid username/password'});
  }

  // check jwt authorization token is valid
  jwt.verify(token, JWT_SECRET_KEY, function(error, _) {
    if (error) {
      res.json({status: 'error', error});
    }
  });

  try {
    await User.findByCredentialsAndDelete(email, password);
  } catch (error) {
    return res.json(
        {status: 'error', code: 404, error},
    );
  } finally {
    return res.json({status: 'ok', emssage: 'Unregistration success'});
  }
});

// update password
authController.put('/v1/passwordUpdate', async (req, res) => {
  const {email, oldPassword, newPassword} = req.body;
  const token = req.headers['authorization'];

  // check email & password are valid
  if (!isValidAuthQuery(email, oldPassword) || !isValidPassword(newPassword)) {
    return res.json({status: 'error', error: 'Invalid username/(new)password'});
  }

  // check jwt authorization token is valid
  jwt.verify(token, JWT_SECRET_KEY, function(error, decoded) {
    if (error) {
      res.json({status: 'error', error});
    }
  });

  try {
    const user = await User.findByCredentials(email, oldPassword);
    user.setPassword(newPassword);
    return res.json({status: 'ok'});
  } catch (error) {
    return res.json({status: 'error', error});
  }
});

authController.get('/v1/newAccessToken', async (req, res) => {
  const {email} = req.body;
  const refreshToken = req.headers['authorization'];

  if (!isValidEmail(email)) {
    return res.json({status: 'error', message: 'unvalidEmailAddress'});
  }

  // check jwt authorization token is valid
  jwt.verify(refreshToken, JWT_SECRET_KEY, function(error, decoded) {
    if (error) {
      res.json({status: 'error', error});
    }
  });
  try {
    const user = await User.findByEmail(email);
    const accessToken = user.generateAccessToken();
    return res.json({status: 'ok', accessToken});
  } catch (error) {
    return res.json({status: 'error', error});
  }
});

export {authController};
