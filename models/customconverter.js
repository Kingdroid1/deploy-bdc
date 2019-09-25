const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currSchema = new Schema({
    baseCurrency: { type: String },
    baseValue: { type: Number },
    convertedValue: { type: Number }
},
{
    timestamps: true,
    collection: 'bdcconversions',
});

const conversion = mongoose.model('Conversion', currSchema);

module.exports = conversion