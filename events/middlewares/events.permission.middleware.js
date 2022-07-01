const config = require('../../common/config/env.config');
const ADMIN_PERMISSION = config['permissionLevels']['ADMIN'];
const env = config['environment']
const Event = require('../models/events.model')

exports.onlyHostOrAdminCanDoThisAction = (req, res, next) => {
    let user_permission_level = parseInt(req.jwt.permissionLevel);
    
    let userId = req.jwt.userId;
    let eventId = req.params.eventId;
    
    if (user_permission_level >= ADMIN_PERMISSION) {
        // Is an Admin
        return next();
    } else {
        Event.findByHostAndId(userId, eventId).then((result) => {
            if(result.length > 0){
                let event = result[0]
                if (event.status !== "open"){
                    // Event is locked
                    res.status(403).send({error: "Event that is canceled, locked, ongoing, or finished may not be modified"})
                }
                else{
                    // Is a Host
                    next();
                }
            }
            else{
                // Is not a host
                console.log("user: ", userId)
                console.log("event: ", eventId)
                res.status(403).send({error: "You are not the host"});
            }
        }).catch((err) => {
            res.status(400).send(err);
        });
    }
    

};