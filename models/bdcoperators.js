const mongoose = require('mongoose');
const Schema = mongoose.Schema


const operatorSchema = new Schema({
    name: { type: String, required: true},
    typeOfInstitution: { type: String, required: true},
    streetAddress: { type: String },
    area: { type: String },
    state: { type: String },
    telephone: { type: String },
    country: { type: String, required: true },
    ownershipType: { type: String },
    dateLicensed: { type: String },
    dateRegistered: { type: String },
    postalAddress: { type: String },
    email: { type: String},
    role:{ 
        type: String, 
        required: true,
        enum: ['operator', 'admin'],
        default: 'operator', },
}, {
    timestamps: true,
    collection: 'operators'
});

const Operator = mongoose.model ('Operator', operatorSchema);
module.exports = Operator;