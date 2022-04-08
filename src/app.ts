import express, {Express} from 'express';
import dotenv from 'dotenv';
import {apiController} from './routes/apiController';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Welcome to server!');
});
app.use('/api', apiController);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
