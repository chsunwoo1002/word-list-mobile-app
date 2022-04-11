import express, {Express} from 'express';
import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

import {apiController} from './routes/apiController';

dotenv.config();

const app: Express = express();
const httpPort = process.env.HTTP_PORT;
const httpsPort = process.env.HTTPS_PORT;

app.get('/', (req, res) => {
  res.send('Welcome to server!');
});
app.use('/api', apiController);

// certificates should be change in production
const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, '../cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../cert', 'cert.pem')),
}, app);

const server = http.createServer(app);

server.listen(httpPort, () => {
  console.log(`Server is running at http://localhost:${httpPort}`);
});

sslServer.listen(httpsPort, () => {
  console.log(`Server is running at https://localhost:${httpsPort}`);
});
