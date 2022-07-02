const Users = require('../models/users.model')

exports.emailIsNotTaken = (req, res, next) => {
    let email = req.body.email

    Users.findByEmail(email).
        then((result) => {
            if(result.length > 0){
                res.status(200).send({error:'email is already taken'});
            }
            else{
                next();
            }
            
        })
}

exports.hasPassword = (req, res, next) => {
    if(req.body.password){
        next()
    }
    else{
        res.status(400).send({error:'missing password field'});
    }
}

