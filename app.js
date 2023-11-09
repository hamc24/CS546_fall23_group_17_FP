// Set up an express server that we will use to recieve client requests.
import express from 'express';
const app = express();
app.use(express.json());
import configRoutesFunction from './routes/index.js';

configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
