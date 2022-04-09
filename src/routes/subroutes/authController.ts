import express, {Express} from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {loginModel} from '../../model/user';

const authController: Express = express();
const saltRound = 10;

mongoose.connect('mongodb://localhost:27017/login-app-db');
authController.use(bodyParser.json());

authController.post('/v1/register', (req, res) => {
  const {username, pass} = req.body;

  // check username, password type -> fail return error message error: 'Invalid username'
  // check password following rule
  (async () => {
    const password = await bcrypt.hash(pass, saltRound);
    try {
      const response = await loginModel.create({
        username,
        password,
      });
    } catch (error) {
      //if (error.code === 11000) , error: 'Username already in use'
      return res.json({status: 'error'});
    }
    return res.json({status: 'ok'});
  })();
});

export {authController};
