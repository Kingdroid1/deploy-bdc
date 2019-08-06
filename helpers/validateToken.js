let jwt = require('jsonwebtoken');

const config = require('./../config/config.json');

const validateToken = {};

/** verifyToken method - this method verifies token */

validateToken.verifyToken = function(req, res, next){
    
    //Request header with authorization key
    const bearerHeader = req.headers['authorization'];

    //Check if there is  a header
    if(typeof bearerHeader !== 'undefined'){

        const bearer = bearerHeader.split(' ');
        
        //Get Token arrray by spliting
        const bearerToken = bearer[1];

        req.token = bearerToken;

        jwt.verify(bearerToken, config.secret, (err, result) => {
            if(!err) { 
                next();
            } else { 
                res.sendStatus(403);
            }
        });
    } else {
        res.sendStatus(403);
    }
};

module.exports = validateToken;

