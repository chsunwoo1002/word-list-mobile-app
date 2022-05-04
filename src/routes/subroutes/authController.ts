import express, {Express} from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {User} from '../../model/user';
import {isValidPassword, isValidAuthQuery} from '../../utils/authUtils';

dotenv.config();

// set variables
const authController: Express = express();
const saltRound = 10;
const dbPath = process.env.MONGO_DB_URL;

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
              id: user._id.str,
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
              data: {id: user._id.str},
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
  if (!isValidAuthQuery(email, password)) {
    return res.json({status: 'error', error: 'Invalid username/password'});
  }
  try {
    const user = await User.findByCredentials(email, password);
    await User.findOneAndDelete({
      username,
      password,
    });
  } catch (error: unknown) {
    return res.json(
        {status: 'error', code: 404, error: 'Not found user data'},
    );
  } finally {
    return res.json({status: 'ok', emssage: 'Unregistration success'});
  }
});

authController.put('/v1/passwordUpdate', async (req, res) => {
  const {email, oldPassword, newPassword} = req.body;
  if (!isValidAuthQuery(email, oldPassword)) {
    return res.json({status: 'error', error: 'Invalid username/password'});
  }
  if (!isValidPassword(newPassword)) {
    return res.json({status: 'error', error: 'Invalid new password'});
  }
  const user = await User.findOne({username: email}).lean();
  if (!user) {
    return res.json({status: 'error', error: 'Invalid username/password'});
  }
  if (!await bcrypt.compare(oldPassword, user.password)) {
    return res.json({status: 'error', error: 'Invalid username/password'});
  }
  const newPass = await bcrypt.hash(newPassword, saltRound);
  try {
    await User.findOneAndUpdate(
        {username: email}, {password: newPass});
  } catch (error: unknown) {
    return res.json({status: 'error', error: 'Update password failed'});
  } finally {
    return res.json({status: 'ok', message: 'Update password success'});
  }
});

export {authController};
