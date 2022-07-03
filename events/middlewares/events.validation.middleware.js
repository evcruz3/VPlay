const Events = require('../models/events.model')
const mongoose = require('../../common/services/mongoose.service').mongoose
const config = require('../../common/config/env.config')
const ADMIN_PERMISSION = config['permissionLevels']['ADMIN'];

exports.eventStatusIs = (status) =>{
    return (req, res, next) => {
        // let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
        // let page = 0;
        // if (req.query) {
        //     if (req.query.page) {
        //         req.query.page = parseInt(req.query.page);
        //         page = Number.isInteger(req.query.page) ? req.query.page : 0;
        //     }
        // }
        let user_permission_level = parseInt(req.jwt.permissionLevel);
    
        // Bypass if admin
        if(user_permission_level >= ADMIN_PERMISSION){
            next()
        }
        else{
            let query = {_id: mongoose.Types.ObjectId(req.params.eventId), status : status}
            console.log(query)
            Events.checkIfExisting(query).then((result) => {
                if (result){
                    next()
                }
                else
                    res.status(403).send({error: `Event that is not ${status} may not be modified`});
            }).catch((err) => {
                res.status(400).send(err);
            });
        }
        
    }
} 


