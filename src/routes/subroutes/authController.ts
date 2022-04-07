import express, {Express} from 'express';

const authController: Express = express();

authController.get('/v1/definition/:language/:word', (req, res) => {

});

export {authController};
