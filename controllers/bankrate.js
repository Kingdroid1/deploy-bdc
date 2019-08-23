const Bank = require('../models/bankrate');

module.exports.getRates = (req,res) =>{
    const sortby= {createdAt:-1}
    Bank.find({}).sort(sortby).limit(5)
      .then((bank)=>{
        res.status(200)
            .json({
              status:true,
              result:bank
            })
      })
      .catch(err=>{res.status(404).json(err)})
  }
  
  module.exports.addRates = (req, res) => {
      var bank = new Bank(
          req.body
      );
      
      bank.save()
          .then(() => res.status(200)
              .json({
                  status: true,
                  message: 'Bank currency saved successfully'
              }))
          .catch(err => res.send(err));
  }