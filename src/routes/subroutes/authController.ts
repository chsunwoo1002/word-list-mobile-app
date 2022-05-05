import express, {Express} from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {User} from '../../model/user';
import {
  isValidPassword,
  isValidAuthQuery,
  isValidEmail,
  messages,
} from '../../utils/authUtils';
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
        .status(401)
        .json({status: 'error', message: messages.error.invalidInput});
  }

  // try get user collection from db
  // if found, return refresh/access tokens with id
  try {
    const user = await User.findByCredentials(email, password);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    const isPasswordMatched = await user.checkPassword(password);

    if (isPasswordMatched) {
      return res
          .status(200)
          .json(
              {
                status: 'ok',
                message: messages.ok.login,
                data: {
                  id: user._id.toString(),
                },
                refreshToken,
                accessToken,
              });
    }
  } catch (e) {
    return res
        .status(401)
        .json({status: 'error', message: messages.error.notFoundUser});
  }
});

// handle http request for sign up
authController.post('/v1/register', async (req, res) => {
  const {email, password, firstName, lastName} = req.body;

  // check email/password format is correct
  if (!isValidAuthQuery(email, password)) {
    return res
        .status(400)
        .json({status: 'error', message: messages.error.invalidInput});
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
        .status(200)
        .json(
            {
              status: 'ok',
              message: messages.ok.register,
              data: {id: user._id.toString()},
              refreshToken,
              accessToken,
            });
  } catch (error) {
    return res
        .status(409)
        .json({status: 'error', message: messages.error.usernameInUse});
  }
});

// delete user information
authController.delete('/v1/unregister', async (req, res) => {
  const {email, password} = req.body;
  const token = req.headers['authorization'];

  // check email & password are valid
  if (!isValidAuthQuery(email, password)) {
    return res
        .status(400)
        .json({status: 'error', message: messages.error.invalidInput});
  }
  // eslint-disable-next-line max-len
  // jwt error.name = 'TokenExpiredError' || 'NotBeforeError' || 'JsonWebTokenError'
  // check jwt authorization token is valid
  jwt.verify(token, JWT_SECRET_KEY, function(error, _) {
    if (error) {
      res.status(401).json({status: 'error', message: error.name});
    }
  });

  try {
    await User.findByCredentialsAndDelete(email, password);
    return res
        .status(200)
        .json({status: 'ok', message: messages.ok.unregister});
  } catch (error) {
    return res
        .status(401)
        .json({status: 'error', message: messages.error.notFoundUser});
  }
});

// update password
authController.put('/v1/passwordUpdate', async (req, res) => {
  const {email, oldPassword, newPassword} = req.body;
  const token = req.headers['authorization'];

  // check email & password are valid
  if (!isValidAuthQuery(email, oldPassword) || !isValidPassword(newPassword)) {
    return res
        .status(401)
        .json({status: 'error', message: messages.error.invalidInput});
  }

  // check jwt authorization token is valid
  jwt.verify(token, JWT_SECRET_KEY, function(error, _) {
    if (error) {
      res.status(401).json({status: 'error', message: error.name});
    }
  });

  try {
    const user = await User.findByCredentials(email, oldPassword);
    user.setPassword(newPassword);
    return res
        .status(200)
        .json({status: 'ok', meesage: messages.ok.passwordUpdate});
  } catch (error) {
    return res
        .status(401)
        .json({status: 'error', message: messages.error.notFoundUser});
  }
});

authController.get('/v1/newAccessToken', async (req, res) => {
  const {email} = req.body;
  const refreshToken = req.headers['authorization'];

  if (!isValidEmail(email)) {
    return res
        .status(401)
        .json({status: 'error', message: messages.error.invalidInput});
  }

  // check jwt authorization token is valid
  jwt.verify(refreshToken, JWT_SECRET_KEY, function(error, _) {
    if (error) {
      res.status(401).json({status: 'error', message: error.name});
    }
  });
  try {
    const user = await User.findByEmail(email);
    const accessToken = user.generateAccessToken();
    return res
        .status(200)
        .json({status: 'ok', message: messages.ok.newAccessToken, accessToken});
  } catch (error) {
    return res
        .status(401)
        .json({status: 'error', message: messages.error.notFoundUser});
  }
});

export {authController};
