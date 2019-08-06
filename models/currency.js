const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const currencySchema = new Schema({
    name: { 
        type: String, 
        required: true,
        enum: ['USD', 'EUR', 'GBP', 'YEN', 'NGN']
    }

}, {
    timestamps: true,
    collection: 'currencies',
});

module.exports = mongoose.model ('Currency', currencySchema);

