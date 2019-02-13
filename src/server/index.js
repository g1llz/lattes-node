const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('../http/routes');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options('*', cors());
routes(app);

module.exports = app;
