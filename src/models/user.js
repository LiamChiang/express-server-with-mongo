const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const stage = process.env.NODE_ENV

const Schema = mongoose.Schema;

const userSchema = new Schema({
    account: {
        type: 'String',
        required: true,
        trim: true,
        unique: true,
        dropDups: true
    },
    password: {
        type: 'String',
        required: true,
        trim: true
    }
});

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    // use bcrypt hash the password
    bcrypt.genSalt(stage.SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.statics = {
    verifyPassword: (input, password) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(input, password)
                .then(match => {
                    resolve(match);
                        
                })
                .catch(err => {
                    reject(err);
                });
        })
    }
}

module.exports = mongoose.model('Users', userSchema);