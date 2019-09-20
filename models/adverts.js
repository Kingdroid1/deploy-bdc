const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advertSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name:           {type: String, required: false},
    advertImage:    {type: String, required: true},
    targetUrl:      {type: String, required: false},
    type: { type: String, enum: ['BASE', 'LEFT', 'LANDING', 'RIGHT'], default: "LANDING"}
}, {
    timestamps: true,
    collection: 'adverts'
});

const Advert = mongoose.model ('Advert', advertSchema);
module.exports = Advert;

