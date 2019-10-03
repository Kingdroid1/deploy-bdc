const mongoose = require('mongoose');
const Schema = mongoose.Schema


const operatorSchema = new Schema({
    name: { type: String},
    typeOfInstitution: { type: String},
    streetAddress: { type: String },
    area: { type: String },
    state: { type: String },
    telephone: { type: String },
    country: { type: String},
    ownershipType: { type: String },
    dateLicensed: { type: String },
    dateRegistered: { type: String },
    postalAddress: { type: String },
    email: { type: String},
    role:{ 
        type: String, 
        enum: ['operator', 'admin'],
        default: 'operator', },
}, {
    timestamps: true,
    collection: 'bdcoperators'
});

const Operator = mongoose.model ('Operator', operatorSchema);
module.exports = Operator;