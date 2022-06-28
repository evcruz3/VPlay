const Users = require('../models/users.model')

exports.emailIsNotTaken = (req, res, next) => {
    let email = req.body.email

    Users.findByEmail(email).
        then((result) => {
            //console.log(result)
            if(result.length > 0){
                res.status(200).send({error:'email is already taken'});
            }
            else{
                next();
            }
            
        })
}

exports.hasUsername = (req, res, next) => {
    if(req.body.username){
        next()
    }
    else{
        res.status(400).send({error:'missing username field'});
    }
}

