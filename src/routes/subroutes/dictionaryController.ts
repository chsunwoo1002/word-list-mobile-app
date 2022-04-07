import express, {Express} from 'express';

const dictionaryController: Express = express();

dictionaryController.get('/v1/definition/:language/:word', (req, res) => {

});

export {dictionaryController};
