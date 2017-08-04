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
    Restaurant.find(req.query)
        .select('name cuisine')
        .lean()
        .then(restaurants => res.send(restaurants))
        .catch(next);
});

app.get('/restaurants/:id', (req, res, next) => {
    Restaurant.findById(req.params.id)
        .lean()
        .then(restaurant => res.send(restaurant))
        .catch(next);
});

app.post('/restaurants/:id/reviews', (req, res, next) => {
    const review = req.body;
    Restaurant.findOne({ 'reviews.email': review.email })
        .count()
        .then(count => {
            if(count) throw { code: 400, error: 'cannot save a second review' };
            
            return Restaurant.findByIdAndUpdate(req.params.id, {
                $push: { reviews: review }
            }, { new: true })
        })
        .then(restaurant => res.send(restaurant.reviews))
        .catch(next);
});


app.use(errorHandler());

module.exports = app;
