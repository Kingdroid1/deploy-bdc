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

async function rate_scrolllocation(result) {
	let location_rates = [];
	
	result.forEach((location) => {
		let obj = location;
		let rates = obj.rates;
		location_rates.push(select_rate(location._id, rates));
	});
	return location_rates;
}

function select_rate(location, rates) {

	let mornings = rates.filter(rate => rate.timeOfDay == "morning");
	let afternoons = rates.filter(rate => rate.timeOfDay == "afternoon");
	let evenings = rates.filter(rate => rate.timeOfDay == "evening");

	let currency_morning = mornings.filter( morning => morning)

	return { location: location, morning: mornings[0], afternoon: afternoons[0], evening: evenings[0] };
}

function rate_historical(result) {
    //console.log(result.result);
    
    
    let locationRates = {};

	result.forEach((rateLocation) => {
		locationRates[rateLocation._id.location] = locationRates[rateLocation._id.location] ? locationRates[rateLocation._id.location] : {}
		locationRates[rateLocation._id.location][rateLocation._id.date] = locationRates[rateLocation._id.location][rateLocation._id.date] ? locationRates[rateLocation._id.location][rateLocation._id.date] : {}

		let morning = rateLocation.rates.filter(rate => rate.time == "morning");
		let afternoon = rateLocation.rates.filter(rate => rate.time == "afternoon");
		let evening = rateLocation.rates.filter(rate => rate.time == "evening");
        // locationRates[rateLocation._id.location][rateLocation._id.currency] = { morning: morning[0], afternoon: afternoon[0], evening: evening[0] };
        locationRates[rateLocation._id.location][rateLocation._id.date][rateLocation._id.currency] = { morning: morning[0], afternoon: afternoon[0], evening: evening[0] };
        // console.log(locationRates);
	});

	let locations = Object.keys(locationRates);
	let RatesAll = [];
	locations.forEach(location => {
		console.log(location);
		let currencies = Object.keys(locationRates[location]);
		let currencyValue = [];
		currencies.forEach(currency => {
			currencyValue.push({ date: currency, "value": locationRates[location][currency] });
        });

        console.log("date", currencies);
        
        let c = {"data" : currencyValue };
		RatesAll.push({ "location": location, "dates":c });
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


function isscrollEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return false;
	}
	return true;
}


module.exports.getScrollRate = (req, res) => {

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
	]).exec(async (err, rates) => {

		if (err) return (err);

		let check = isscrollEmpty(rates);

		console.log("rates=====>", rates);

		switch (check) {
			case false:
				
				let result = await rate_scrolllocation(rates);

				return res.status(200)
					.json({
						status: true,
						result: result
					});

			case true:
				getMostRecentScrollRate();

			default:
				return undefined;
		}

	});

	function getMostRecentScrollRate() {

		Rate.aggregate([
			{ '$match': { date: { '$exists': true } } },
			{ '$sort': { createdAt: -1, date: -1 } },
			{
				$group: {
					_id: '$location',
					rates: {
						$addToSet: {
							currency: '$baseCurrency',
							date: '$date', selling: '$sellingRate',
							timeOfDay: '$time',
							buying: '$buyingRate',
							currency: '$baseCurrency'
						}
					}
				}
			}
		])
			.exec(async (err, rates) => {
				if (err) return (err);

				let result = await rate_scrolllocation(rates);

				return res.status(200)
					.json({
						status: true,
						result: result
					});
			});
	}
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

		Rate.aggregate([
			{ '$match': { date: { '$exists': true } } },
			{ '$sort': { date: -1, sellingRate: -1, buyingRate: 1 } },
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
	const today = moment().startOf('day').format('YYYY-MM-D');
	const nowDay = moment().day();
	const lastDay = moment().day(nowDay -7).format('YYYY-MM-D');

	console.log(lastDay);

	Rate.aggregate([
		{ '$match': { date: { '$lte': today, '$gte': lastDay } } },
		{ '$sort': { date: -1, sellingRate: -1, buyingRate: 1 } },
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

	Rate.aggregate([
		{ '$match': { time: 'morning' } }
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

/**
 * Seed the database
 */
module.exports.seedRate = (req, res) => {
	// create some events
	const rates = [
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 250, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'morning', date: '2019-08-25' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 255, user_id: '5d384433850f0a49d8bd4af1', location: 'Kogi', time: 'morning', date: '2019-08-25' },
		{ baseCurrency: 'USD', sellingRate: 260, buyingRate: 259, user_id: '5d384433850f0a49d8bd4af1', location: 'Lagos', time: 'afternoon', date: '2019-08-25' },
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
