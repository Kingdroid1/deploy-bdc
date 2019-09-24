// Skip to content
 
// Search or jump to…

// Pull requests
// Issues
// Trending
// Explore
 
// @ebunola 
// Learn Git and GitHub without any code!
// Using the Hello World guide, you’ll start a branch, write comments, and open a pull request.

 
// 1 0 feyex/Bdc
//  Code  Issues 0  Pull requests 0  Wiki  Releases
// Bdc/Bdc-Backend/controllers/rateManagement.js
// @feyex feyex all up to date
// 65361fa yesterday
// @dtytomi @feyex @ebunola
// 509 lines (408 sloc)  14.9 KB
    
const Rate = require('../models/rate');
const Location = require('../models/locations');
const dayTime = require('../models/time');
const Time = require('./time-mgt');
const async = require('async');
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

  let currency_morning = mornings.filter(morning => morning)

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
		{ '$match': { createdAt: new Date(today) } },
		{ $sort: { sellingRate: 1, buyingRate: -1, createdAt: -1 } },
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
			{ '$match': { createdAt: { '$exists': true } } },
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

module.exports.scrollingRate = (req, res) => {
	const today = moment().startOf('day').format('YYYY-MM-D');

	Rate.aggregate([
		{ '$match': { $or: [{ createdAt: { $gte: new Date(today) } }, { createdAt: { $lt: new Date(today) } }] } },
		{ $sort: { sellingRate: 1, buyingRate: -1, createdAt: -1 } },
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
			{ '$match': { createdAt: { '$exists': true } } },
			{ '$sort': { createdAt: -1, sellingRate: 1, buyingRate: -1 } },
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

module.exports.getRate = (req, res) => {

	const today = moment().startOf('day').format('YYYY-MM-D');

	Rate.aggregate([
		{ '$match': { createdAt: { $gte: new Date(today) } } },
		{ $sort: { sellingRate: 1, buyingRate: -1, createdAt: -1 } },
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

		console.log("True", rates);

		let check = isEmpty(rates);

		switch (check) {
			case false:

				let result = await rate_location(rates);
				console.log("Result ===> ", result);
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
			{ '$match': { createdAt: { '$exists': true } } },
			{ '$sort': { createdAt: -1, sellingRate: 1, buyingRate: -1 } },
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
	const lastDay = moment().day(nowDay - 7).format('YYYY-MM-D');

	Rate.aggregate([
		{ '$match': { $or: [{ createdAt: { $lt: new Date(today) } }, { createdAt: { $gte: new Date(lastDay) } }] } },
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
	// const { id } =req.params;
	let userId = req.params.userId;

	Rate.find({user_id: userId})
	.then(userId => res.status(200).json({
		status: true,
		userId: userId,
	})).catch(err => res.send("Error from", err))
}

module.exports.mobileRate = (req, res) => {

	let location = req.query.location ? req.query.location : 'Lagos';

	Rate.find({
		'location': location,
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
	const lastDay = moment().day(nowDay - 7).format('YYYY-MM-D');

	let location = req.query.location ? req.query.location : 'Lagos';

	Rate.aggregate([
		{ '$match': { $or: [{ createdAt: { $lt: new Date(today) } }, 
			{ createdAt: { $gte: new Date(lastDay) } }],
			'location': location }},
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
