const chai = require('chai');
const chaiHttp = require('chai-http');
const { assert } = chai;
chai.use(chaiHttp);

const connect = require('../lib/connect');
const app = require('../lib/app');
const request = chai.request(app);

describe('restaurants', () => {

    before(() => {
        return connect('mongodb://localhost:27017/review-test')
            .then(connection => connection.dropDatabase());
    });

    let list = null;
    let restaurants = [{
        name: 'eaterez',
        address: {
            street: '10 NW Davis',
            city: 'Portland'
        },
        cuisine: 'northwest'
    }, {
        name: 'mungch',
        address: {
            street: '20 SW 3rd',
            city: 'Portland'
        },
        cuisine: 'asian'
    }]

    function saveRestaurant(restaurant) {
        return request.post('/restaurants')
            .send(restaurant)
            .then(req => req.body);
    }

    before(() => {
        return Promise.all(restaurants.map(saveRestaurant))
            .then(saved => {
                restaurants = saved
                list = saved.map(({ _id, name, cuisine}) => {
                    return { _id, name, cuisine };
                })
            });
    })

    it('GET /restaurants', () => {
        return request
            .get('/restaurants')
            .then(({ body: got }) => {
                assert.deepEqual(got, list);
            });
    });

    it('GET /restaurants by cuisine', () => {
        return request
            .get('/restaurants?cuisine=northwest')
            .then(({ body: got }) => {
                assert.deepEqual(got, [list[0]]);
            });
    });

    describe('reviews', () => {

        let list = null;
        let reviews = [
            {
                rating: 3,
                comments: 'meh',
                email: 'user1@email.com'
            },
            {
                rating: 5,
                comments: 'wow, food was incredible',
                email: 'user2@email.com'
            },
            {
                rating: 4,
                comments: 'good service, decent rood',
                email: 'user3@email.com'
            }
        ]

        let id = null;
        before(() => id = restaurants[0]._id);
        
        function saveReview(review) {
            return request.post(`/restaurants/${id}/reviews`)
                .send(review)
                .then(req => req.body);
        }

        before(() => {
            return Promise.all(reviews.map(saveReview))
                .then(([,,saved]) => {
                    reviews = saved;
                });
        });

        it('includes those reviews when getting restaurant', () => {
            return request.get(`/restaurants/${id}`)
                .then(({ body: restaurant }) => {
                    assert.deepEqual(restaurant.reviews, reviews);
                });
        });

        it('bad request for user to save second review of same restaurant', () => {
            return saveReview({ rating: 1, comments: 'wat', email: 'user1@email.com' })
                .then(
                    () => { throw new Error('expected 400 http status code'); },
                    err => {
                        assert.ok(err.response.badRequest);
                    }
                );
        });
    });
    
});