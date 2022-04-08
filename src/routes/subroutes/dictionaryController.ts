import express, {Express} from 'express';
import {isValidQuery} from '../utils/dictionaryUtils';

const dictionaryController: Express = express();

dictionaryController.get('/v1/definition/:language/:word', (req, res) => {
  const language = req.query.language as string;
  const word = req.query.language as string;
  if (isValidQuery(language, word)) {
    console.log();
  } else {
    console.log();
  }
});

dictionaryController.get('/v1/synonyms/:language/:word', (req, res) => {
  const language = req.query.language as string;
  const word = req.query.language as string;
  if (isValidQuery(language, word)) {
    console.log();
  } else {
    console.log();
  }
});

dictionaryController.get('/v1/antonyms/:language/:word', (req, res) => {
  const language = req.query.language as string;
  const word = req.query.language as string;
  if (isValidQuery(language, word)) {
    console.log();
  } else {
    console.log();
  }
});

export {dictionaryController};
