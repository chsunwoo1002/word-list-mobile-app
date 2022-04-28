import express, {Express} from 'express';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import path from 'path';

import {apiController} from './routes/apiController';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Welcome to server!');
});
app.use('/api', apiController);

// certificates should be change in production
const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, '../cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../cert', 'cert.pem')),
}, app);

sslServer.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
