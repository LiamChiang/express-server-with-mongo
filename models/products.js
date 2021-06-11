const mongoose = require('mongoose');
const collection = process.env.MONGO_PRODUCTION_COLLECTION;

// make the schema and make to collection
const Schema = mongoose.Schema;

const productsSchema = new Schema({
        name: {
            type: 'String',
            required: true,
            trim: true,
        },
        date: {
            type: 'Date',
            default: Date.now()
        },
        code: {
            type: 'String',
            required: true,
            trim: true,
            unique: true,
        },
        status: {
            type: 'String',
            required: true,
            trim: true,
        }
    },
    { collection : collection });

productsSchema.pre('record', (next) => {
    if (!this.isModified || !this.isNew) {
        next();
    }
    else {
        this.date = Date.now();
        next();
    }

})

module.exports = mongoose.model('Products', productsSchema);