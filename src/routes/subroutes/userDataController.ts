import express, {Express} from 'express';

const userDataController: Express = express();

userDataController.get('/v1/definition/:language/:word', (req, res) => {

});

export {userDataController};
