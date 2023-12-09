const express = require('express');
const bodyParser = require('body-parser');
const { processSingle, processConcurrent } = require('./controller/sortingController');

const app = express();
app.listen(8000, () => {
    console.log('Server listening on port 8000');
  });

app.use(bodyParser.json());

app.post('/process-single', processSingle);
app.post('/process-concurrent', processConcurrent);

