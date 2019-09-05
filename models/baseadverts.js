const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const baseadvertSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:     {type: String, required:false},
    advertImage: {type: String, required: true},
    targetUrl: {type: String, required: false}
},
{
    timestamps: true,
    collation: 'baseadverts'
});

const BaseAdvert = mongoose.model ('BaseAdvert', baseadvertSchema);
module.exports = BaseAdvert;