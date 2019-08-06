const Rate = require('../models/rate');
const Time = require('../controllers/time-mgt');

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
	Rate.find({})
		.sort({ created_at: -1 })
		.then(rate => res.status(200)
			.json({
				status: true,
				result: rate
			}))
		.catch(err => res.send(err));
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