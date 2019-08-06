const User = require('../models/users');
const Advert = require('../models/adverts');
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports.createAdvert = (req, res) => {
	var advert = new Advert(
		//need to add advert details
		req.body
	);


	advert.save(function (err, resp) {
		if (err) {
			res.status(201)
			.json({
				message: 'something went wrong '
			})
		} else {
			res.status(200)
			.json({
				status: true,
				message: 'advert saved successful'
			})
		}

	});
}

module.exports.listAdvert = (req, res) => {
	Advert.find({})
		.then(advert => res.status(200)
			.json({
				status: true,
				message: (advert)
			}))
		.then(err => res.send(err));
}

module.exports.getAdvert = (req, res) => {
	const { id } = req.params;

	// only allow admins to access other user records
   
	Advert.findById(id)
		.then(advert => res.status(200)
			.json({
				status: true,
				message: (advert)
			}))
		.then(err => res.send(err));
}

module.exports.updateAdvert = (req, res) => {
	Advert.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(user => res.status(200)
			.json({
				status: true,
				message: (user)
			}))
		.then(err => res.send(err));
}

module.exports.deleteAdvert = (req, res) => {
	const { id } = req.params;
	Advert.findByIdAndRemove({ id })
		.then(advert => res.status(200)
			.json({
				status: true,
				message: 'advert fetched',
				advert
			}))
		.then(err => res.send(err));
}