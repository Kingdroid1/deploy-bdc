const Cbn = require('../models/western');

module.exports.getRates = (req,res) =>{
    const sortby= {createdAt:-1}
    Cbn.find({}).sort(sortby).limit(5)
      .then((cbn)=>{
        res.status(200)
            .json({
              status:true,
              result:cbn
            })
      })
      .catch(err=>{res.status(404).json(err)})
  }
  
  module.exports.addRates = (req, res) => {
      var cbn = new Cbn(
          req.body
      );
      
      cbn.save()
          .then(() => res.status(200)
              .json({
                  status: true,
                  message: 'Western currency saved successfully'
              }))
          .catch(err => res.send(err));
  }