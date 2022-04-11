import express, {Express} from 'express';
import bodyParser from 'body-parser';
import {isValidDictionaryQuery} from '../../utils/dictionaryUtils';

const dictionaryController: Express = express();
dictionaryController.use(bodyParser.json());

dictionaryController.get('/v1/definition/', (req, res) => {
  const {language, word} = req.body;
  if (isValidDictionaryQuery(language, word)) {
    console.log();
  } else {
    console.log();
  }
});

dictionaryController.get('/v1/synonyms/', (req, res) => {
  const {language, word} = req.body;
  if (isValidDictionaryQuery(language, word)) {
    console.log();
  } else {
    console.log();
  }
});

dictionaryController.get('/v1/antonyms/', (req, res) => {
  const {language, word} = req.body;
  if (isValidDictionaryQuery(language, word)) {
    console.log();
  } else {
    console.log();
  }
});

export {dictionaryController};
