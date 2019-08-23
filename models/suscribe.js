const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const suscribeSchema = new Schema({
    email : {type: String, required:true, unique:true}
})

const suscribe = mongoose.model('suscribe', suscribeSchema);
module.exports = suscribe;