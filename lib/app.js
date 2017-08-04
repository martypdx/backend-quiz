const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');
const restaurants = require('./restaurants');

const app = express();

app.use(bodyParser.json());
app.use('/restaurants', restaurants);
app.use(errorHandler());

module.exports = app;
