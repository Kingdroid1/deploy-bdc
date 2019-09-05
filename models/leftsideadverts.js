const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leftadvertSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:           {type: String, required: false},
    advertImage:    {type: String, required: true},
    targetUrl:      {type: String, required: false},
}, {
    timestamps: true,
    collection: 'leftadverts'
});

const LeftAdvert = mongoose.model ('LeftAdvert', leftadvertSchema);
module.exports = LeftAdvert;