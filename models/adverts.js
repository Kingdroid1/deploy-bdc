const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advertSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: false},
    advertImage: {type: String, required: true}
    // imageUrl: { type: String, required: true},
    // targetUrl: { type: String, required: true},
    // page: { type: String, required:true}
}, {
    timestamps: true,
    collection: 'adverts'
});

const Advert = mongoose.model ('Advert', advertSchema);
module.exports = Advert;

