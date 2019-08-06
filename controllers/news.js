const User = require('../models/users');
const News = require('../models/news');
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports.createNews = (req, res) => {
	var news = new News(
		//need to add advert details
		req.body
	);


	news.save(function (err, resp) {
		if (err) {
			res.status(201)
			.json({
				message: 'something went wrong '
			})
		} else {
			res.status(200)
			.json({
				status: true,
				message: 'news saved successful'
			})
		}

	});
}

module.exports.listNews = (req, res) => {
	News.find({})
		.then(news => res.status(200)
			.json({
				status: true,
				message: (news)
			}))
		.then(err => res.send(err));
}

module.exports.getNews = (req, res) => {
	const { id } = req.params;

	// only allow admins to access other user records
   
	News.findById(id)
		.then(news => res.status(200)
			.json({
				status: true,
				message: (news)
			}))
		.then(err => res.send(err));
}

module.exports.updateNews = (req, res) => {
	News.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(user => res.status(200)
			.json({
				status: true,
				message: (user)
			}))
		.then(err => res.send(err));
}

module.exports.deleteNews = (req, res) => {
	const { id } = req.params;
	News.findByIdAndRemove({ id })
		.then(news => res.status(200)
			.json({
				status: true,
				message: 'news fetched',
				news
			}))
		.then(err => res.send(err));
}