import express, {Express} from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {loginModel} from '../../model/user';
import * as EmailValidator from 'email-validator';
import {validatePassword} from '../utils/authUtils';

const authController: Express = express();
const saltRound = 10;

mongoose.connect('mongodb://localhost:27017/login-app-db');
authController.use(bodyParser.json());

authController.post('/v1/register', (req, res) => {
  const {email, pass} = req.body;

  if (!email || typeof email !== 'string' || !EmailValidator.validate(email)) {
    return res.json({status: 'error', error: 'Invalid username'});
  }
  if (!pass || typeof pass !== 'string' || validatePassword(pass)) {
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
        return res.json({status: 'error', error: 'Username already in use'});
      } else {
        return res.json({status: 'error', error: 'Unknown error in db'});
      }
    }
    return res.json({status: 'ok'});
  })();
});

export {authController};
