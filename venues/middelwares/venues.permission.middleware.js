const Venues = require('../models/venues.model')
const mongoose = require('../../common/services/mongoose.service').mongoose
const ObjectId = mongoose.Types.ObjectId
const config = require('../../common/config/env.config')
const ADMIN_PERMISSION = config['permissionLevels']['ADMIN'];

exports.onlyAuthorOrAdminCanDoThisAction = (req, res, next) => {

    let user_permission_level = parseInt(req.jwt.permissionLevel);

    if(user_permission_level >= ADMIN_PERMISSION){
        next()
    }
    else{
        let query = {author : ObjectId(req.jwt.userId), _id: ObjectId(req.params.venueId)}

        Venues.checkIfExisting(query).then((result) => {
            if (result){
                next()
            }
            else{
                res.status(403).send();
            }
        }).catch((err) => {
            console.log(err)
            res.status(400).send(err);
        });
    }
}


