const chai = require('chai');
const chaiHttp = require('chai-http');
const { assert } = chai;
chai.use(chaiHttp);

const connect = require('../lib/connect');
const app = require('../lib/app');
const request = chai.request(app);

describe('auth', () => {

    before(() => {
        return connect('mongodb://localhost:27017/review-test')
            .then(connection => connection.dropDatabase());
    });

    let restaurants = [
        {
            name: 'eaterez',
            address: {
                street: '10 NW Davis',
                city: 'Portland'
            },
            cuisine: 'northwest'
        },
        {
            name: 'mungch',
            address: {
                street: '20 SW 3rd',
                city: 'Portland'
            },
            cuisine: 'asian'
        }
    ]

    function saveRestaurant(restaurant) {
        return request.post('/restaurants')
            .send(restaurant)
            .then(req => req.body);
    }
    
    function saveReview(id, review) {
        return request.post(`/restaurants/${id}/reviews`)
            .send(review)
            .then(req => req.body);
    }

    before(() => {
        return Promise.all(restaurants.map(saveRestaurant))
            .then(saved => {
                restaurants = saved
            });
    })

    it('GET /restaurants', () => {
        return request
            .get('/restaurants')
            .then(({ body: got }) => {
                assert.deepEqual(got, restaurants);
            });
    });

    
});