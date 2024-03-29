const Rate = require('../models/rate');
const Time = require('./timemgt');
const moment = require('moment');
const csv = require('csv');
const fs = require('fs');

function formatDate(date) {
	var year = date.getFullYear().toString();
	var month = (date.getMonth() + 101).toString().substring(1);
	var day = (date.getDate() + 100).toString().substring(1);
	return year + "-" + month + "-" + day;
}



function rate_location(result) {

	let locationRates = {};

	result.forEach((rateLocation) => {
		locationRates[rateLocation._id.location] = locationRates[rateLocation._id.location] ? locationRates[rateLocation._id.location] : {}

		let morning = rateLocation.rates.filter(rate => rate.time == "morning");
		let afternoon = rateLocation.rates.filter(rate => rate.time == "afternoon");
		let evening = rateLocation.rates.filter(rate => rate.time == "evening");
		locationRates[rateLocation._id.location][rateLocation._id.currency] = { morning: morning[0], afternoon: afternoon[0], evening: evening[0] };
	});

	let locations = Object.keys(locationRates);
	let RatesAll = [];
	locations.forEach(location => {
		console.log(location)
		let currencies = Object.keys(locationRates[location]);
		let currencyValue = [];
		currencies.forEach(currency => {
			currencyValue.push({ currency: currency, "value": locationRates[location][currency] });
		});

		RatesAll.push({ "location": location, "currencies": currencyValue });
	});

	return RatesAll;
}


function rate_historical(result) {

	let locationRates = {};

	result.forEach((rateLocation) => {
		locationRates[rateLocation._id.location] = locationRates[rateLocation._id.location] ? locationRates[rateLocation._id.location] : {}
		locationRates[rateLocation._id.location][rateLocation._id.date] = locationRates[rateLocation._id.location][rateLocation._id.date] ? locationRates[rateLocation._id.location][rateLocation._id.date] : {}

		let morning = rateLocation.rates.filter(rate => rate.time == "morning");
		let afternoon = rateLocation.rates.filter(rate => rate.time == "afternoon");
		let evening = rateLocation.rates.filter(rate => rate.time == "evening");
		// locationRates[rateLocation._id.location][rateLocation._id.currency] = { morning: morning[0], afternoon: afternoon[0], evening: evening[0] };
		locationRates[rateLocation._id.location][rateLocation._id.date][rateLocation._id.currency] = { morning: morning[0], afternoon: afternoon[0], evening: evening[0] };
	});

	let locations = Object.keys(locationRates);
	let RatesAll = [];
	locations.forEach(location => {
		let currencies = Object.keys(locationRates[location]);
		let currencyValue = [];
		currencies.forEach(currency => {
			currencyValue.push({ date: currency, "value": locationRates[location][currency] });
		});

		let c = { "data": currencyValue };
		RatesAll.push({ "location": location, "dates": c });
	});

	return RatesAll;
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

module.exports.scrollingRate = (req, res) => {

	const today = moment().startOf('day').format('YYYY-MM-D');

	Rate.aggregate([
		{ '$match': { createdAt: { $gte: new Date(today) } } },
		{ $sort: { sellingRate: -1, buyingRate: 1, createdAt: -1 } },
		{
			$group: {
				_id: { location: '$location', currency: '$baseCurrency' },
				rates: {
					$addToSet: '$$ROOT'
				}
			}
		}
	]).exec(async (err, rates) => {

		if (err) return (err);

		let result = await rate_location(rates);

		return res.status(200)
			.json({
				status: true,
				result: result
			});

	});

}

module.exports.getRate = (req, res) => {

	const today = moment().startOf('day').format('YYYY-MM-D');

	Rate.aggregate([
		{ '$match': { createdAt: { $gte: new Date(today) } } },
		{ $sort: { sellingRate: -1, buyingRate: 1, createdAt: -1 } },
		{
			$group: {
				_id: { location: '$location', currency: '$baseCurrency' },
				rates: {
					$addToSet: '$$ROOT'
				}
			}
		}
	]).exec(async (err, rates) => {

		if (err) return (err);

		let check = isEmpty(rates);

		switch (check) {
			case false:

				let result = await rate_location(rates);

				return res.status(200)
					.json({
						status: true,
						result: result
					});

			case true:
				getMostRecentRate();
			default:
				return undefined;
		}

	});

	function getMostRecentRate() {

		const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');

		Rate.aggregate([
		{ '$match': { createdAt: { $gte: new Date(startOfMonth) } } },
		{ '$sort': { createdAt: -1, sellingRate: -1, buyingRate: 1 } },
			{
				$group: {
					_id: { location: '$location', currency: '$baseCurrency' },
					rates: {
						$addToSet: '$$ROOT'
					}
				}
			}
		])
			.exec(async (err, rates) => {
				if (err) return (err);

				let result = await rate_location(rates);

				return res.status(200)
					.json({
						status: true,
						result: result
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

module.exports.historicalRate = (req, res) => {

	const nowDay = moment().day();

	let today = req.query.toDay ? req.query.toDay : moment().startOf('day').format('YYYY-MM-D');
	let lastDay = req.query.fromDay ? req.query.fromDay : moment().day(nowDay).format('YYYY-MM-D');

	Rate.aggregate([
		{ '$match': { $or: [{ createdAt: { $lt: new Date(lastDay) } }, { createdAt: { $gte: new Date(today) } }] } },
		{ '$sort': { createdAt: -1, sellingRate: 1, buyingRate: -1 } },
		{
			$group: {
				_id: { location: '$location', currency: '$baseCurrency', date: '$date' },
				rates: {
					$addToSet: '$$ROOT'
				}
			}
		}
	])
		.exec(async (err, rates) => {
			if (err) return (err);

			let result = await rate_historical(rates);

			return res.status(200)
				.json({
					status: true,
					result: result
				});
		});
}



module.exports.csvRate = (req, res) => {

	let location = req.query.location ? req.query.location : 'Lagos';
	let currency = req.query.currency ? req.query.currency : 'USD';

	Rate.find({
		'time': 'morning',
		'location': location,
		'baseCurrency': currency
	}, { _id: 0, date: 1, sellingRate: 1, buyingRate: 1 })
		.exec((err, rates) => {
			if (err) return (err);

			let columns = {
				date: 'Day Index',
				sellingRate: 'Selling Rate',
				buyingRate: 'Buying Rate'
			};

			csv.stringify(rates, { header: true, columns: columns }, (err, output) => {
				if (err) throw err;
				fs.writeFile('my.csv', output, (err) => {
					if (err) throw err;
					else {
						return res.download('my.csv', 'rates.csv', (err) => {
							if (err) throw err;
						})
					}
				});
			});
		});
}

module.exports.getRatebyUserId = (req, res) => {

	let userId = req.params.userId;

	Rate.find({ user_id: userId })
		.then(userId => res.status(200).json({
			status: true,
			userId: userId,
		}))
		.catch(err => res.send("Error from", err));

}

module.exports.mobileRate = (req, res) => {

	let location = req.query.location ? req.query.location : 'Lagos';
	const today = moment().startOf('day').format('YYYY-MM-D');

	Rate.find({
		'location': location,
		createdAt: { $gte: new Date(today) },
	})
		.exec((err, rates) => {
			if (err) return (err);

			return res.status(200)
				.json(
					rates
				);
		});
}


module.exports.mobilehistoricalRate = (req, res) => {

	const today = moment().startOf('day').format('YYYY-MM-D');
	const nowDay = moment().day();
	const lastDay = moment().day(nowDay - 5).format('YYYY-MM-D');

	let location = req.query.location ? req.query.location : 'Lagos';
	let currency = req.query.currency ? req.query.currency : 'USD';

	Rate.aggregate([
		{
			'$match': {
				$or: [{ createdAt: { $lt: new Date(today) } },
				{ createdAt: { $gte: new Date(lastDay) } }],
				'location': location,
				'baseCurrency': currency
			}
		},
		{ '$sort': { createdAt: -1, sellingRate: 1, buyingRate: -1 } },
		{
			$group: {
				_id: { date: '$date' },
				rates: {
					$addToSet: '$$ROOT'
				}
			}
		}
	])
		.exec(async (err, rates) => {
			if (err) return (err);


			return res.status(200)
				.json(rates);
		});
}

/**
 * Seed the database
 */
module.exports.seedRate = (req, res) => {
	// create some events
	const rates = [
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'morning', date: '2019-08-30' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 255, user_id: '5d384433850f0a49d8bd4af1', location: 'Kogi', time: 'morning', date: '2019-08-30' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 259, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'afternoon', date: '2019-08-29' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'evening', date: '2019-08-25' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'evening', date: '2019-08-21' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'evening', date: '2019-08-22' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Kogi', time: 'morning', date: '2019-08-25' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Apapa', time: 'morning', date: '2019-08-25' },
		{ baseCurrency: 'GBP', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'morning', date: '2019-08-25' },
		{ baseCurrency: 'GBP', sellingRate: 260, buyingRate: 255, user_id: '5d384433850f0a49d8bd4af1', location: 'Kogi', time: 'morning', date: '2019-08-25' },
		{ baseCurrency: 'GBP', sellingRate: 260, buyingRate: 259, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'afternoon', date: '2019-08-25' },
		{ baseCurrency: 'GBP', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'evening', date: '2019-08-25' },
		{ baseCurrency: 'GBP', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Kogi', time: 'morning', date: '2019-08-25' },
		{ baseCurrency: 'GBP', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Apapa', time: 'morning', date: '2019-08-25' },
		{ baseCurrency: 'YEN', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'morning', date: '2019-08-25' },
		{ baseCurrency: 'YEN', sellingRate: 260, buyingRate: 255, user_id: '5d384433850f0a49d8bd4af1', location: 'Kogi', time: 'morning', date: '2019-08-25' },
		{ baseCurrency: 'YEN', sellingRate: 260, buyingRate: 259, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'afternoon', date: '2019-08-25' },
		{ baseCurrency: 'YEN', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'evening', date: '2019-08-25' },
		{ baseCurrency: 'YEN', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Kogi', time: 'morning', date: '2019-08-25' },
		{ baseCurrency: 'YEN', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Apapa', time: 'morning', date: '2019-08-25' },
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
