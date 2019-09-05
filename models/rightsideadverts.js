const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rightadvertSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:           {type: String, required: false},
    advertImage:    {type: String, required: true},
    targetUrl:      {type: String, required: false},
}, {
    timestamps: true,
    collection: 'rightadverts'
});

const RightAdvert = mongoose.model ('RightAdvert', rightadvertSchema);
module.exports = RightAdvert;