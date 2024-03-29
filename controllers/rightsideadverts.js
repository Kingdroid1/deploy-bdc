const User = require('../models/users');
const RightAdvert = require('../models/rightsideadverts');
const mongoose = require("mongoose");
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


module.exports.createAdvert = (req, res, next) => {
	// res.send('done');
	console.log("from the advert backend", req.file)
   const rightAdvert = new RightAdvert({
	   _id: new mongoose.Types.ObjectId(),
	   name : req.body.name,
	   advertImage: req.file.filename,
	   targetUrl: req.body.targetUrl,

   });
   rightAdvert.save()
   .then(result => {
	   console.log("from inside the response", result);
	   res.status(201).json({
		   message: "RightAdvert Created Successfully",
		   createdAdvert: {
			name: result.name,
			_id: result._id
           },
           advert: result
	   })
   }).catch(err => {
	   console.log("error from advert", err);
	   res.status(500).json({
		   msg:"server error",
		   error: err
	   })
   })
};

//new get all active method
module.exports.getAllAdverts = (req, res, next) => {
	RightAdvert.find().sort({createdAt:-1})
	.select("name _id advertImage")
	.exec()
	.then(docs => {
		const response = {
			count: docs.length,
			advert: docs.map(doc => {
				return{
					name: doc.name,
					advertImage: doc.advertImage,
					_id: doc._id,
					request: {
						type: "GET",
						url:"http://localhost:5000/api/rightadverts/" + doc._id
					}
				}
			})
		};
		res.status(200).json(response);
	})
	.catch(err => {
		console.log("error form the backend", err);
		res.status(500).json({
			msg: "server err",
			error: err
		})
	})
}

module.exports.getAdvert = (req, res) => {
	const { id } = req.params;

	// only allow admins to access other user records
   
	RightAdvert.findById(id)
		.then(advert => res.status(200)
			.json({
				status: true,
				message: (advert)
			}))
		.then(err => res.send(err));
}

//Get advet by Id active method 
module.exports.getAdvertById = (req, res, next) => {
	const id = req.params.id;
	RightAdvert.findById(id)
	.select("name _id advertImage")
	.exec()
	.then(doc => {
		console.log("From Database", doc);
		if (doc) {
			res.status(200).json({
				advert: doc,
				request: {
					type: "GET",
            url: "http://localhost:5000/api/rightadverts"
				}
			})
		}else {
			res.status(404).json({
				message: "No valid entry found for the advert ID"
			});
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			msg: "Server Error",
			error: err
		})
	})
}

module.exports.updateAdvert = (req, res) => {
	RightAdvert.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(user => res.status(200)
			.json({
				status: true,
				message: (user)
			}))
		.then(err => res.send(err));
}

module.exports.deleteAdvert = (req, res) => {
	const { id } = req.params;
	RightAdvert.findByIdAndRemove({ id })
		.then(advert => res.status(200)
			.json({
				status: true,
				message: 'advert fetched',
				advert
			}))
		.then(err => res.send(err));
}

module.exports.seedImage = (req, res) => {
	console.log("file fro seed data", req.file)
	const image = [
		{
			imageUrl: "C:\Users\SBSC\Pictures\signature.png"
			// targetUrl: "",			
		}
	];
	
	RightAdvert.deleteOne({}, () => {
		var newImage = new RightAdvert(image);
		newImage.save();
	})

	// seeded!
	res.send('Database seeded!')
}