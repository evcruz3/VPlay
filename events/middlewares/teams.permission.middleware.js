const Teams = require('../models/teams.model')
const Events = require('../models/events.model')
const mongoose = require('../../common/services/mongoose.service').mongoose
const ObjectId = mongoose.Types.ObjectId
const config = require('../../common/config/env.config')
const ADMIN_PERMISSION = config['permissionLevels']['ADMIN'];

exports.onlyHostAdminOrTeamMemberCanDoThisAction = (req, res, next) => {

    let user_permission_level = parseInt(req.jwt.permissionLevel);
    let userId = req.jwt.userId
    let eventId = req.params.eventId

    if(user_permission_level >= ADMIN_PERMISSION){
        next()
    }
    else{
        Events.findByHostAndId(userId, eventId).then((result) => {
            if(result.length > 0){
                // Is a Host
                next();
            }
            else{
                // Is not a host
                let query = {$and: 
                    [
                        {eventId:eventId},
                        {
                            $or: [{open1:ObjectId(userId)},
                                {open2:ObjectId(userId)},
                                {opposite:ObjectId(userId)},
                                {mid1:ObjectId(userId)},
                                {mid2:ObjectId(userId)},
                                {setter:ObjectId(userId)},
                                {libero:ObjectId(userId)}]
                        }
                    ]
                }
                Teams.checkIfExisting(query).then((result) => {
                    if(result == true)
                        next()
                    else
                        res.status(200).send({error: "You are not part of the teams of this event"});
                }).catch((err) => {
                    res.status(400).send(err);
                });
            }
        }).catch((err) => {
            res.status(400).send(err);
        });
    }
}


