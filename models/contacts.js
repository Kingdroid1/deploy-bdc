// contact-us model
const mongoose = require('mongoose');
const Schema = mongoose.Schema



const contactSchema = new Schema({
 
    firstname: { type: String},
    lastname: { type: String},
    email: { type: String},
    subject: { type: String},
    message: { type: String},
}, {
    timestamps: true,
   
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;

