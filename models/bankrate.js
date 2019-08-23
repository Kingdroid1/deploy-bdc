const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const bankrateSchema = new Schema({
    date: {  type: Date, required: true },
    baseCurrency:{ type: String, required: true }, 
    bankName: { type: String, required: true},
    sellingRate: { type: Number, required: true}


}, {
    timestamps: true,
   
});

module.exports = mongoose.model ('Bankrate', bankrateSchema);

