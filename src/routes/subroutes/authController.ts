import express, {Express} from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {userModel} from '../../model/user';
import {isValidPassword, isValidAuthQuery} from '../../utils/authUtils';

dotenv.config();

const authController: Express = express();
const saltRound = 10;

// Change to env val
mongoose.connect('mongodb://localhost:27017/app-db');
authController.use(bodyParser.json());

authController.post('/v1/login', async (req, res) => {
  const {email, password} = req.body;

  if (!isValidAuthQuery(email, password)) {
    return res.json({status: 'error', error: 'Invalid username/password'});
  }
  const user = await userModel.findOne({username: email}).lean();
  console.log(user);
  if (!user) {
    return res.json({status: 'error', error: 'Cannot find username/password'});
  }
  if (await bcrypt.compare(password, user.password)) {
    return res.json({status: 'ok', error: null,
      data: {
        id: user._id.str,
        email: email,
        password: password,
      }});
  }
  return res.json({status: 'error', error: 'Cannot find username/password'});
});

authController.post('/v1/register', async (req, res) => {
  const {email, password} = req.body;

  if (!isValidAuthQuery(email, password)) {
    return res.json({status: 'error', error: 'Invalid username/password'});
  }

  const hashedPassword = await bcrypt.hash(password, saltRound);
  const username = email.toLowerCase();

  try {
    const tmp =await userModel.create({
      username: username,
      password: hashedPassword,
      favourite: [],
      memorized: [],
    });
    console.log(tmp);
  } catch (error: unknown) {
    if ((error as {code: number}).code === 11000) {
      return res.json(
          {status: 'error', code: 409, error: 'Username already in use'});
    } else {
      return res.json({status: 'error', error: 'Unknown error in db'});
    }
  } finally {
    return res.json({status: 'ok', message: 'Registration success'});
  }
});

authController.delete('/v1/unregister', async (req, res) => {
  const {email, pass} = req.body;

  if (!isValidAuthQuery(email, pass)) {
    return res.json({status: 'error', error: 'Invalid username/password'});
  }
  const user = await userModel.findOne({username: email}).lean();
  if (!user) {
    return res.json({status: 'error', error: 'Invalid username/password'});
  }
  const password = await bcrypt.hash(pass, saltRound);
  const username = email.toLowerCase();
  try {
    await userModel.findOneAndDelete({
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
  const user = await userModel.findOne({username: email}).lean();
  if (!user) {
    return res.json({status: 'error', error: 'Invalid username/password'});
  }
  if (!await bcrypt.compare(oldPassword, user.password)) {
    return res.json({status: 'error', error: 'Invalid username/password'});
  }
  const newPass = await bcrypt.hash(newPassword, saltRound);
  try {
    await userModel.findOneAndUpdate(
        {username: email}, {password: newPass});
  } catch (error: unknown) {
    return res.json({status: 'error', error: 'Update password failed'});
  } finally {
    return res.json({status: 'ok', message: 'Update password success'});
  }
});

export {authController};
