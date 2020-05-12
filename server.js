const port = 80;

const express = require('express');
const app = express();
app.use(require('body-parser').json());
app.use(express.static(__dirname + ''));

app.listen(port);
