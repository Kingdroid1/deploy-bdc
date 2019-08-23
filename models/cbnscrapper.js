const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cbnscrapperSchema = new Schema({
    date: {  type: Date, required: true },
    baseCurrency:{ type: String, required: true }, 
    buyingRate: { type: Number, required: true},
    sellingRate: { type: Number, required: true}


}, {
    timestamps: true,
   
});

module.exports = mongoose.model ('Cbnscrapper', cbnscrapperSchema);

