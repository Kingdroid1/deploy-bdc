const User = require('../models/users');
const config = require('../config/config.json');
const Location = require('../models/locations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports.createUser = (req, res) => {

	var user = new User(
		//need to add user details
		req.body
	);
	console.log(req.body)
	user.save()
		.then(() => res.status(200)
			.json({
				status: true,
				message: 'user saved successfully'
			}))
		.catch(err => res.send({
			message: 'something went wrong ',
			err: err
		}));
}

module.exports.listUsers = (req, res) => {
	User.find({})
		.then(user => res.status(200)
			.json({
				status: true,
				result: user
			}))
		.catch(err => res.send(err));
}

module.exports.getUser = (req, res) => {
	const { id } = req.params;

	// only allow admins to access other user records
	User.findById(id)
		.then(user => res.status(200)
			.json({
				status: true,
				message: (user)
			}))
		.catch(err => res.send(err));
}

module.exports.updateUser = (req, res) => {
	User.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(user => res.status(200)
			.json({
				status: true,
				message: (user)
			}))
		.catch(err => res.send(err));
}

module.exports.deleteUser = (req, res) => {
	User.deleteOne({
		_id: req.params.id
	}).then(user => {
		console.log(user);
		res.status(200).json({
			status: true,
			msg: 'User deleted successfully'
		})
	})
}


module.exports.login = (req, res) => {
	const email = req.body.email;
	console.log('user email', email);
	console.log(req.body);

	User.findOne({ 'email': email })
		.then(async (user) => {
			if (!user) {
				return res.status(200).send({
					message: 'email does not exist'
				});
			}
			else {
				const password = req.body.password;
				bcrypt.compare(password, user.password)
					.then(result => {
						if (result) {
							const token = jwt.sign({ sub: user.id, role: user.role }, config.secret, {
								expiresIn: 3600 // expires soon
							});
							const id = user._id;
							const role = user.role;

							Location.findById(user.location_Id)
								.then(result => {
									return res.status(201).json({
										status: true,
										message: 'user logged in',
										token,
										id,
										role,
										location: result
									})
								})
								.catch(err => { return err });

							//console.table(localStorage);
							// localStorage.setItem("token", token);
							// console.log(localStorage.getItem("token"));

							console.log('Token:',token);
							
							//Vue.localStorage.set('token')


						} else {
							return res.status(201).json({
								status: false,
								message: 'failed to log in'
							});
						}
					});
			}
		});
}


module.exports.updatepassword = (req, res) => {
	const password = bcrypt.hashSync(req.body.password)

	User.findOneAndUpdate(req.params.id, { 'password': password })
		.then(user => res.status(200)
			.json({
				status: true,
				message: (user)
			}))
		.catch(err => res.send(err));
}

module.exports.createPassword = (req, res) => {
	const email = req.body.email;

	User.findOne({ 'email': email })
		.then(async (user) => {
			if (!user) {
				return res.status(200).send({
					status: false,
					message: 'email does not exist'
				});
			}
			else {
				const password = bcrypt.hashSync(req.body.password);

				user.updateOne({ password: password }, function (err) {
					if (err) {
						res.status(201)
							.json({
								message: 'something went wrong ',
								err: err
							})
					} else {
						res.status(200)
							.json({
								status: true,
								message: 'password created successfully'
							})
					}
				});

			}
		});
}

module.exports.comparepassword = (req, res) => {

	User.findById(req.params.id)
		.then(async (user) => {
			if (user) {
				const password = req.body.password;
				bcrypt.compare(password, user.password)
					.then(result => {
						if (result) {

							return res.status(200).json({
								status: true,
								message: 'password exist'
							});
						}
						else {
							return res.status(201).json({
								status: false,
								message: 'password does not exist'
							});
						}

					})

			}
			else {
				return res.status(201).json({
					status: false,
					message: 'id does not exist'
				});
			}
		})

}

/**
 * Seed the database
 */
module.exports.seedAdmin = (req, res) => {
	// create some admin
	const admin = {
		firstname: 'Admin',
		lastname: 'Admin',
		email: 'admin@bdc.com',
		password: 'admin',
		role: 'admin',
		location_id: '5d3821249cce6611d8179ccf'
	};

	// use the Event model to insert/save
	User.deleteOne({}, () => {
		var newAdmin = new User(admin);
		newAdmin.save();
	});

	// seeded!
	res.send('Database seeded!');
}

/**
 * Seed the database
 */
module.exports.logout = (req, res) => {

}