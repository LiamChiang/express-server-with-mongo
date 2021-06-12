const mongoose = require('mongoose');

// make the schema and make to collection
const Schema = mongoose.Schema;

const productsSchema = new Schema({
    name: {
        type: 'String', // the product's name
        required: true,
        trim: true,
    },
    date: {
        type: 'Date',  // the product's date be stored in the db
        default: Date.now()
    },
    code: {
        type: 'String',  // the product's unique code
        required: true,
        trim: true,
        unique: true,
    },
    status: {
        type: 'String',  // the product's status: new, modify, release
        required: true,
        trim: true,
    }
});

module.exports = mongoose.model('Products', productsSchema);