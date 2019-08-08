const Operator = require('../models/bdcoperators');
const config = require('../config/config.json');
const Location = require('../models/locations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports.createOperator = (req, res) => {
	var operator = new Operator(
		//need to add Operator details
		req.body
	);
	
	operator.save()
	.then((data) => {
			console.log('operator saved',data)
			res.status(200)
			.json({
				status: true,
				message: 'Operator saved successfully'
			});
	})
	.catch(err => {
		console.log('error operator',err)
		res.send({
			message: 'something went wrong ',
			err: err 
		})
	});

	
}

module.exports.listOperators = (req, res) => {
	Operator.find({}).limit(10)
		.then(operators => res.status(200)
			.json({
				status: true,
				message: (operators)
			}))
		.catch(err => res.send(err));
}

module.exports.getOperator = (req, res) => {
	const { id } = req.params;

	// only allow admins to access other Operator records
   
	Operator.findById(id)
		.then(operator => res.status(200)
			.json({
				status: true,
				message: (operator)
			}))
		.catch(err => res.send(err));
}

module.exports.updateOperator = (req, res) => {
	Operator.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(operator => res.status(200)
			.json({
				status: true,
				message: (operator)
			}))
		.catch(err => res.send(err));
}

module.exports.deleteOperator = (req, res) => {
	Operator.deleteOne({
        _id: req.params.id
    }).then(operator => {
        console.log(operator);
        res.status(200).json({
            status: true,
            msg: 'Operator deleted successfully'
        })
    })
}