import express, {Express} from 'express';
import {dictionaryController} from './subroutes/dictionaryController';
import {authController} from './subroutes/authController';
import {userDataController} from './subroutes/userDataController';

const apiController: Express = express();

apiController.use('/dictionary', dictionaryController);
apiController.use('/userAuth', authController);
//apiController.use('/userData', userDataController);

export {apiController};
