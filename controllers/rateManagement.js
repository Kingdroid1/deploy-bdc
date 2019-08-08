	const Rate = require('../models/rate');
const Location = require('../models/locations');
const dayTime = require('../models/time');
const Time = require('./time-mgt');
const moment = require('moment');
const async = require('async');


module.exports.addRate = (req, res) => {

	Time.getTime(req.body.time)
		.then(result => {

			let rate = new Rate();
			rate.baseCurrency = req.body.baseCurrency;
			rate.sellingRate = req.body.sellingRate;
			rate.buyingRate = req.body.buyingRate;
			rate.user_id = req.body.user_id;
			rate.location = req.body.location;
			rate.time = result;

			rate.save()
				.then(() =>
					res.status(200).json({
						status: true,
						msg: 'Rate created successfully'
					})
				)
				.catch(err => res.status(404).json(err))

		})
		.catch(err => {
			console.log(err);
		});

}

module.exports.getRate = (req, res) => {

	async.waterfall([
		_function1(req, res),
		_function2,
		_function3
	], function (error, success) {
		if (error) { console.log('Something is wrong!'); }
		return console.log('Done!');
	});
}

function _function1(req, res) {
	return function (callback) {
		Location.find({})
			.exec(function (err, locations) {
				if (err) callback(err);
				// Return Location
				let rateLocation = locations.map(location => {
					return location.name;
				});
				console.log("loci:" + rateLocation);
				callback(null, req, res, rateLocation)
			});
	}
}

function _function2(req, res, rateLocation, callback) {
	console.log(rateLocation, "got here");
	dayTime.find({})
		.exec(function (err, timeOfTheDay) {
			if (err) callback(err);
			// Return Time
			console.log("timeofday ===>", timeOfTheDay);
			let rateTime = timeOfTheDay.map(time => {
				return time.timeOfDay;
			});

			callback(null, req, res, rateLocation, rateTime);
		});
}

function _function3(req, res, rateTime, rateLocation, callback) {
	console.log("rateTime========>", rateTime, rateLocation)
	const today = moment().startOf('day');
	console.log("gte", today)
	console.log("lte", moment(today).endOf('day').toDate())
	Rate.find({
		createdAt: {
			$gte: today.toDate(),
			$lte: moment(today).endOf('day').toDate()
		}
	})
		.sort('-buyingRate sellingRate')
		.where('time').all(rateTime)
		.where('location').all(rateLocation)
		.then(rate => res.status(200)
			.json({
				status: true,
				result: rate
			}))
		.catch(err => res.send(err));
	callback(null);
}

module.exports.listRate = (req, res) => {
	Rate.find({})
		.then(rate => res.status(200)
			.json({
				status: true,
				result: rate
			}))
		.catch(err => res.send(err));
}