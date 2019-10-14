const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const abconSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true }
},
    { timestamps: true,
    collections: 'abconnews'
})

const AbconNews = mongoose.model('AbconNews', abconSchema);

module.exports = AbconNews;