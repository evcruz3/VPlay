const ScheduleModel = require('../models/schedules.model');
const config = require('../../common/config/env.config')
const season = config.season
const ObjectId = require('../../common/services/mongoose.service').mongoose.Types.ObjectId

exports.deleteEventSchedule = (req, res, next) => {
    ScheduleModel.deleteMany(req.params.eventId)
    .then((result) => {
        next()
    }).catch((e) => {
        console.log("delete error: ", e)
        res.status(400).send(e)
    })
}

exports.createEventSchedule = (req, res) => {

    //let document = {}
    //document.eventId = ObjectId(req.params.eventId)
    let schedule = []

    try{
        req.body.schedule.forEach(element => {
            let match = {};
            
            match.eventId = ObjectId(req.params.eventId)
            match.gameNumber = parseInt(element.gameNumber)
            match.teamA = ObjectId(element.teamA)
            match.teamB = ObjectId(element.teamB)

            schedule.push(match)
            
        });
    } catch (error) {
        res.status(400).send(error)
    }
        
    ScheduleModel.insertMany(schedule)
    .then((result) => {
        res.status(201).send();
    }).catch((e) => {
        console.log("insert error: ", e)
        res.status(400).send(e)
    });
    
};

exports.list = (req, res) => {
    if(req.query.populate==='true'){
        ScheduleModel.getEventSchedulePopulated(req.params.eventId).then((results) => {
            res.status(200).send(results)
        }).catch((error) => {
            console.log(error)
            res.status(400).send({error:error})
        })
    }
    else{
        ScheduleModel.getEventSchedule(req.params.eventId).then((results) => {
            res.status(200).send(results)
        }).catch((error) => {
            res.status(400).send(error)
        })
    }
};

exports.cancelSchedule = (req, res) => {
    req.body.status = "canceled"

    ScheduleModel.patchSchedule(req.params.scheduleId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

