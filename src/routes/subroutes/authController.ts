import express, {Express} from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import {loginModel} from '../../model/user';
import bcrypt from 'bcrypt';

const authController: Express = express();

/*
'api/auth/v1/register
method: Post
headers: {
  'content-Type: 'application/json'
}
body: JSON.stringify ({
  username, password
})
*/
type A = Awaited<Promise<string>>;

mongoose.connect('mongodb://localhost:27017/login-app-db');
const saltRound = 10;
authController.use(bodyParser.json());

authController.post('/v1/register', (req, res) => {
  const {username, password} = req.body;
  const salt = async () => await bcrypt.genSalt(saltRound);
  const hash = async () => await bcrypt.hash(password, salt);
  console.log(hash);
});

export {authController};
