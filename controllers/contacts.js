const Contact = require('../models/contacts');


module.exports.createContact = (req, res) => {
	var contact = new Contact(
		req.body
	);
	
	contact.save()
		.then(result => res.status(201)
			.json({
				status: true,
				message: 'Message sent Successfully',
				result
			}))
		.catch(err => res.send(err));
}

module.exports.listContacts = (req, res) => {
	Contact.find({})
		.then(user => res.status(200)
			.json({
				status: true,
				result: user
			}))
		.catch(err => res.send(err));
}

module.exports.getConstantById = (req, res) => {
	const { id } = req.params;

	// only allow admins to access other user records
	Contact.findById(id)
		.then(user => res.status(200)
			.json({
				status: true,
				user,				
			})
			)
		.catch(err => res.send(err));
}




module.exports.updateConatct = (req, res) => {
	let id = req.params.id
	Contact.findByIdAndUpdate(id, req.body, { new: true })
			.then(user => res.status(200)
				.json({
					status: true,
					user,
					updatedId:user._id
				}))
			.catch(err => res.send(err));
	}





module.exports.deleteContact = (req, res) => {
	Contact.deleteOne({
		_id: req.params.id
	}).then(user => {
		console.log(user);
		res.status(200).json({
			status: true,
			msg: 'Contact deleted successfully'
		})
	})
}

/**
 * Seed the database
 */
module.exports.seedContact = (req, res) => {
	// create some admin
	const contact = {
		firstname: 'Admin',
		lastname: 'Admin',
		email: 'admin@bdc.com',
		subject: 'Seed Subject',
		message: 'Seed Message',
	};

	// use the Event model to insert/save
	Contact.deleteOne({}, () => {
		var newContact = new Contact(contact);
		newContact.save();
	});

	// seeded!
	res.send('Database seeded!');
}

/**
 * Logout
 */
module.exports.logout = (req, res) => {

}