import express, {Express} from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import {userModel} from 'src/model/user';

const userDataController: Express = express();

mongoose.connect('mongodb://localhost:27017/app-db');
userDataController.use(bodyParser.json());

userDataController.get('/v1/all', async (req, res) => {
  const {userid} = req.body;
  const userWords =
    await userModel.find({_id: userid}, {favourite: 1, memorized: 1}).lean();
  if (!userWords) {
    return res.json({status: 'error', error: 'Cannot find the user data'});
  }

  return res.json(
      {status: 'ok',
        data: {
          //favourite: userWords.favourite,
          //memorized: userWords.memorized
        }});
});

userDataController.get('/v1/favourite', async (req, res) => {
  const {userid} = req.body;
  const userWords =
    await userModel.find({_id: userid}, {favourite: 1}).lean();
  if (!userWords) {
    return res.json({status: 'error', error: 'Cannot find the user data'});
  }

  return res.json(
      {status: 'ok',
        data: {//favourite: userWords.favourite
        }});
});

userDataController.get('/v1/memorized', async (req, res) => {
  const {userid} = req.body;
  const userWords =
    await userModel.find({_id: userid}, {memorized: 1}).lean();
  if (!userWords) {
    return res.json({status: 'error', error: 'Cannot find the user data'});
  }

  return res.json(
      {status: 'ok',
        data: {//memorized: userWords.memorized
        }});
});

// add/delete word in memorized
userDataController.put('/v1/memorized', async (req, res) => {
  const {word, userid, isInsertion} = req.body;
});

// add/delete word in favourit
userDataController.put('v1/favourite', async (req, res) => {
  const {word, userid, isInsertion} = req.body;
});


export {userDataController};
