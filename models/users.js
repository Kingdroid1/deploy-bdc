const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
    firstname: { type: String, required: true},
    lastname: { type: String, required: true},
    email: { type: String, unique:true, required: true},
    location_id: { type: Schema.ObjectId, ref: "Location", required: true},
    role:{ 
        type: String, 
        required: true,
        enum: ['operator', 'admin'],
        default: 'operator', },
    password:{ type: String}
}, {
    timestamps: true,
    collection: 'users'
});

// Events
 userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            console.error(err);
            next();
        });
    });
});

// Validate Email
userSchema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
 }, 'The e-mail field cannot be empty, and must be formatted properly');

const User = mongoose.model ('User', userSchema);
module.exports = User;

