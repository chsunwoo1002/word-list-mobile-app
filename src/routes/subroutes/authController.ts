import express, {Express} from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {loginModel} from '../../model/user';
import {isValidPassword, isValidEmail} from '../../utils/authUtils';

dotenv.config();

const authController: Express = express();
const saltRound = 10;

// Change to env val
mongoose.connect('mongodb://localhost:27017/login-app-db');
authController.use(bodyParser.json());

authController.post('/v1/register', (req, res) => {
  const {email, pass} = req.body;

  if (!isValidEmail(email)) {
    return res.json({status: 'error', error: 'Invalid username'});
  }
  if (!isValidPassword(pass)) {
    return res.json({status: 'error', error: 'Invalid password'});
  }
  (async () => {
    const password = await bcrypt.hash(pass, saltRound);
    const username = email.toLowerCase();
    try {
      await loginModel.create({
        username,
        password,
      });
    } catch (error: unknown) {
      if ((error as {code: number}).code === 11000) {
        return res.json(
            {status: 'error', code: 409, error: 'Username already in use'});
      } else {
        return res.json({status: 'error', error: 'Unknown error in db'});
      }
    } finally {
      return res.json({status: 'ok'});
    }
  })();
});

authController.delete('/v1/unregister', (req, res) => {
  const {email, pass} = req.body;

  if (!isValidPassword(pass)) {
    return res.json({status: 'error', error: 'Invalid password'});
  }
  (async () => {
    const password = await bcrypt.hash(pass, saltRound);
    const username = email.toLowerCase();
    try {
      await loginModel.findOneAndDelete({
        username,
        password,
      });
    } catch (error: unknown) {
      return res.json(
          {status: 'error', code: 404, error: 'Not found user data'},
      );
    } finally {
      return res.json({status: 'ok'});
    }
  })();
});

authController.put('/v1/passwordUpdate', (req, res) => {
  const {email, oldPass, newPass} = req.body;
  if (!isValidPassword(oldPass)) {
    return res.json({status: 'error', error: 'Incorrect old password'});
  }
  if (!isValidPassword(newPass)) {
    return res.json({status: 'error', error: 'Invalid new password'});
  }
  (async () => {
    const oldPassword = await bcrypt.hash(oldPass, saltRound);
    const newPassword = await bcrypt.hash(newPass, saltRound);
    try {
      await loginModel.findOneAndUpdate(
          {username: email, password: oldPassword}, {password: newPassword});
    } catch (error: unknown) {
      return res.json({status: 'error', error: 'Update password failed'});
    } finally {
      return res.json({status: 'ok'});
    }
  })();
});

export {authController};
