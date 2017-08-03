const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');
const app = express();
const Restaurant = require('./restaurant');

app.use(bodyParser.json());

app.post('/restaurants', (req, res, next) => {
    new Restaurant(req.body).save()
        .then(restaurant => res.send(restaurant))
        .catch(next);
});

app.get('/restaurants', (req, res, next) => {
    Restaurant.find()
        .lean()
        .then(restaurants => res.send(restaurants))
        .catch(next);
});

app.use(errorHandler());

module.exports = app;
