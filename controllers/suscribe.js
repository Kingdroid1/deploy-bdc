const Suscribe = require ('../models/suscribe');

module.exports.suscribe = (req, res)=>{

Suscribe.findOne({ "email": req.params.email })
.then((user) => {
  if (!user) {
    return res.status(201)
      .json({
        status: false,
        message: 'Email does not exist'
      })
  };
  return res.status(200)
    .json({
      status: true,
      message: 'Email exist'
    })
})
};




module.exports.suscribed = (req, res) =>{

    const suscribe = new Suscribe(req.body);

    suscribe.save()
        .then(() =>{

        res.status(200).json({
        status: true,
        msg: 'Subscription created successfully'
      })
        })
    .catch(err => res.status(404).json(err));

}