const Rate = require('../models/rate');
const Location = require('../models/locations');
const dayTime = require('../models/time');
const Time = require('./time-mgt');
const async = require('async');
const moment = require('moment');

function formatDate(date) {
	var year = date.getFullYear().toString();
	var month = (date.getMonth() + 101).toString().substring(1);
	var day = (date.getDate() + 100).toString().substring(1);
	return year + "-" + month + "-" + day;
}

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
			rate.date = formatDate(new Date());

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


function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

module.exports.getRate = (req, res) => {

	const today = moment().startOf('day').format('YYYY-MM-D');

	Rate.aggregate([
		{ '$match': { date: today } },
		{ $sort: { sellingRate: -1, buyingRate: 1, createdAt: -1 } },
		{
			$group: {
				_id: '$location',
				rates: {
					$push: {
						currency: '$baseCurrency',
						date: '$date', selling: '$sellingRate',
						buying: '$buyingRate', timeOfDay: '$time'
					}
				}
			}
		}
	]).exec((err, rates) => {

		if (err) return (err);

		let check = isEmpty(rates);

		switch (check) {
			case false:
				return res.status(200)
					.json({
						status: true,
						result: rates
					});

			case true:
				getMostRecentRate();

			default: 
				return undefined;
		}

	});

	function getMostRecentRate() {

		Rate.aggregate([
			{ '$match': { date: { '$exists': true } } },
			{ '$sort': { createdAt: -1, date: -1 } },
			{
				$group: {
					_id: '$location',
					rates: {
						$push: {
							currency: '$baseCurrency',
							date: '$date', selling: '$sellingRate',
							buying: '$buyingRate', timeOfDay: '$time'
						}
					}
				}
			}
		])
			.exec((err, rates) => {
				if (err) return (err);

				return res.status(200)
					.json({
						status: true,
						result: rates
					});
			});
	}
}

module.exports.listRate = (req, res) => {

	Rate.find()
		.exec((err, rates) => {
			if (err) callback(err);

			return res.status(200)
				.json({
					status: true,
					result: rates
				});
		});
}

/**
 * Seed the database
 */
module.exports.seedRate = (req, res) => {
	// create some events
	const rates = [
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'morning', date: '2019-08-21' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 255, user_id: '5d384433850f0a49d8bd4af1', location: 'Kogi', time: 'morning', date: '2019-08-21' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 259, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'afternoon', date: '2019-08-21' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'evening', date: '2019-08-21' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Kogi', time: 'morning', date: '2019-08-21' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Apapa', time: 'morning', date: '2019-08-21' },
	];

	// use the Event model to insert/save
	Rate.deleteOne({}, () => {
		for (rate of rates) {
			console.log(rate)
			var newRate = new Rate(rate);
			newRate.save();
		}
	});

	// seeded!
	res.send('Database seeded!');
}
