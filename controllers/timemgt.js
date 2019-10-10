const Time = require('../models/time');

module.exports.createTime = (req, res) => {
  const from = req.body.from;
  const to = req.body.to;
  const timeOfDay = req.body.timeOfDay;
 
  const times = new Time();
  times.from = from;
  times.to = to;
  times.timeOfDay = timeOfDay;

  times.save()
    .then(res.status(200).json(times))
    .catch(err => res.send(err));
}

module.exports.getTimes = (req, res) => {
  Time.find({}).then(times => {
    res.status(200).json({
      status: true,
      message: (times)
    })
  }).then(err => res.send(err));
}

module.exports.getTimeById = (req, res) => {
  let id = req.params.id;

  Time.findById(id)
    .then(time => res.status(200)
      .json({
        status: true,
        result: (time)
      }))
    .then(err => res.send(err));
}

module.exports.getTimeUnit = (req, res) => {
  let tm = req.body;

  Time.find({ from: { $lt: [tm] }, to: { $in: [tm, '24'] } })
    .then(time => res.status(200)
      .json({
        status: true,
        result: (time)
      }))
    .then(err => res.send(err));

}

module.exports.getTime = (time) => {
  let tm = (time);  
  return Time.find({ "from": { $lte: tm },  "to": { $gt: tm } })
    .then(time => {
      return time[0].timeOfDay;
    })
    .catch(() => { return false;})
}

// @route   DELETE /api/times/:id
// @desc    Delete a time
// @access  Public
module.exports.deleteTime = (req, res) => {
  let id = req.params.id
  Time.deleteOne(id).then(() => {
    res.status(200).json({
      status: true,
      msg: 'Location deleted successfully'
    })
  })
}

/**
 * Seed the database
 */
module.exports.seedTimes = (req, res) => {
  
  let timeMorningFrom = 6;
  let timeMorningTo = 10;

  let timeAfternoonFrom = 10;
  let timeAfternoonTo = 13;

  let timeEveningFrom = 13;
  let timeEveningTo = 18;

  const times = [
    { from: timeMorningFrom, to: timeMorningTo, timeOfDay: 'morning'  },
    { from: timeAfternoonFrom, to: timeAfternoonTo, timeOfDay: 'afternoon' },
    { from: timeEveningFrom, to: timeEveningTo, timeOfDay: 'evening' }
  ];

  // use the Event model to insert/save
  Time.deleteMany({}, () => {
    for (time of times) {
      var newTime = new Time(time);
      newTime.save();
    }
  });

  // seeded!
  res.send('Database seeded!');
}