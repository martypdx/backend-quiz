const router = require('express').Router();
const Restaurant = require('./restaurant');

module.exports = router
    .post('/', (req, res, next) => {
        new Restaurant(req.body).save()
            .then(restaurant => res.send(restaurant))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Restaurant.find(req.query)
            .select('name cuisine')
            .lean()
            .then(restaurants => res.send(restaurants))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Restaurant.findById(req.params.id)
            .lean()
            .then(restaurant => res.send(restaurant))
            .catch(next);
    })

    .post('/:id/reviews', (req, res, next) => {
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
