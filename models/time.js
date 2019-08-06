const mongoose = require('mongoose');
const timeZone = require('mongoose-timezone');
const Schema = mongoose.Schema;

const timeSchema = new Schema({
  timeOfDay: {
    type: String,
    required: true,
    enum: ['morning', 'afternoon', 'evening']
  },

  from: {
    type: Number,
    required: true
  },
  to: {
    type: Number,
    required: true
  },

}, {
  timestamp: true,
    collection: 'times'
  }
);

timeSchema.plugin(timeZone);

module.exports = mongoose.model('Time', timeSchema);