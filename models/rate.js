 const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rateSchema = new Schema({
    baseCurrency:{ type: String, required: true },    
    sellingRate: {type: Number, required: true},
    buyingRate: {type: Number, required: true},
    user_id: { type: Schema.ObjectId, ref: 'User' },
    time: { type: String, required: true },
    date: {type: String, required: true},
    location: { type: String, required: true }
}, {
    timestamps: true,
    collection: 'rates',
});

const Rate = mongoose.model ('Rate', rateSchema);
module.exports = Rate;

