const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
      street: String,
      city: String
    },
    cuisine: {
        type: String,
        required: true,
        enum: ['asian', 'euro', 'northwest', 'comfort', 'other']
    },
    reviews: [{
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comments: {
            type: String,
            required: true,
            maxLength: 250
        },
        email: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Restaurant', schema);