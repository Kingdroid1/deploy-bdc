const Currency = require('../models/currency');

module.exports.addCurency = (req, res) => {
	var currency = new Currency(
		req.body
	);
	
	currency.save()
		.then(() => res.status(200)
			.json({
				status: true,
				message: 'currency saved successfully'
			}))
		.catch(err => res.send(err));
}

module.exports.listCurrency = (req, res) => {
	Currency.find({})
		.then(currency => res.status(200)
			.json({
				status: true,
				result: currency
			}))
		.catch(err => res.send(err));
}

module.exports.getCurrency = (req, res) => {
	const { id } = req.params;

	// only allow admins to access other user records
   
	Currency.findById(id)
		.then(currency => res.status(200)
			.json({
				status: true,
				message: (currency)
			}))
		.catch(err => res.send(err));
}

module.exports.updateCurrency = (req, res) => {
	Currency.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(currency => res.status(200)
			.json({
				status: true,
				message: (currency)
			}))
		.catch(err => res.send(err));
}

module.exports.deleteCurrency = (req, res) => {
	const { id } = req.params;
	Currency.findByIdAndRemove({ id })
		.then(currency => res.status(200)
			.json({
				status: true,
				message: 'user fetched',
				currency
			}))
		.catch(err => res.send(err));
} 

/**
 * Seed the database
 */
module.exports.seedCurrency = (req, res) => {
  // create some events
  const currencies = [
    { name: 'USD' },
    { name: 'EUR' },
    { name: 'GBP' },
		{ name: 'YEN' }
		//{name: 'NGN'}
  ];

  // use the Event model to insert/save
  Currency.deleteOne({}, () => {
    for (currency of currencies) {
      var newCurrency = new Currency(currency);
      newCurrency.save();
    }
  });

  // seeded!
  res.send('Database seeded!');
}