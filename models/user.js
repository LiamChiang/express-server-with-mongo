const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const collection = process.env.MONGO_USERS_COLLECTION;

const environment = process.env.NODE_ENV
const stage = require('../config')[environment];

const Schema = mongoose.Schema;

const userSchema = new Schema({
    account: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: 'String',
        required: true,
        trim: true
    }
});

const User = mongoose.model(collection, userSchema);
User.save(function (next) {
    bcrypt.hash(this.password, 5, function(err, hash) {
        if (err) {
            next(err);
        } else {
            console.log('hash: ', hash);
            this.password = hash;
            console.log('this.password: ', this.password);
            next();
        }
  });
});

module.exports = mongoose.model('User', userSchema);