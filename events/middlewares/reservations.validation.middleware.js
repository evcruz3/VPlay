const Reservations = require('../models/reservations.model')
const mongoose = require('../../common/services/mongoose.service').mongoose
const ObjectId = mongoose.Types.ObjectId
const config = require('../../common/config/env.config')
const ADMIN_PERMISSION = config['permissionLevels']['ADMIN'];

exports.UserHasNotReservedYet = (req, res, next) => {

    let user_permission_level = parseInt(req.jwt.permissionLevel);

    if(user_permission_level >= ADMIN_PERMISSION){
        req.body.playerId = ObjectId(req.body.playerId)
    }
    else{
        req.body.playerId = ObjectId(req.jwt.userId)
        req.body.status = "waiting"
    }

    req.body.eventId = ObjectId(req.params.eventId)

    let query = {eventId: req.body.eventId, playerId: req.body.playerId, status : {"$in": ['waiting','not granted']}}

    Reservations.checkIfExisting(query).then((result) => {
        if (result){
            res.status(400).send({error: "User reservation already exists"});
        }
        else{
            next()
        }
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err);
    });
}


