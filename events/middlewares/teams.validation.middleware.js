const Teams = require('../models/teams.model')
const mongoose = require('../../common/services/mongoose.service').mongoose
const config = require('../../common/config/env.config')
const ADMIN_PERMISSION = config['permissionLevels']['ADMIN'];
const _ = require('lodash');
const EventModel = require('../models/events.model');

exports.allEventTeamsIsInScheduleAndViceVersa = (req, res, next) => {

    let scheduledTeams;

    try {
        let teamAs = req.body.schedule.map(({teamA}) => teamA);
        let teamBs = req.body.schedule.map(({teamB}) => teamB);
        scheduledTeams = [...new Set(teamAs.concat(teamBs))].sort()
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
    

    Teams.getEventTeams(req.params.eventId)
    .then((results) => {
        try{

            let eventTeams = results.map(({_id}) => _id.toString()).sort()
           
            if(_.isEqual(eventTeams,scheduledTeams))
                next()
            else{
                res.status(400).send()
            }
        }
        catch (err){
            console.log(err)
            res.status(400).send(err)
        }
    })
    .catch((error) => {
        console.log(error)
        res.status(400).send(error)
    })
    
}

exports.TeamsFollowEventRules = (req,res,next) => {
    EventModel.findById(req.params.eventId).then((event) => {
        try {
            let numberOfTeams = req.body.teams.length
            if (numberOfTeams > event.maxTeam){
                res.status(400).send({err:"violated maxteam for the event"})
            }
                
            req.body.teams.forEach(team => {
                if(team.libero && event.libero == false)
                    res.status(400).send({err:"libero not allowed for the event"})
            });
            next()
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    })
    
}

exports.allEventTeamsPositionsAreFilled = (req, res, next) => {

    let result = req.body.teams.every(obj => 
        obj.hasOwnProperty('open1') && 
        obj.hasOwnProperty('open2') &&
        obj.hasOwnProperty('opposite') &&
        obj.hasOwnProperty('mid1') &&
        obj.hasOwnProperty('mid2') &&
        obj.hasOwnProperty('setter'))

    if (result)
        next()
    else{
        res.status(400).send({"err": "Missing required position field"})
    }
}


