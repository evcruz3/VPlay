const TeamModel = require('../models/teams.model');
const config = require('../../common/config/env.config')
const ADMIN_PERMISSION = config['permissionLevels']['ADMIN'];
const season = config.season
const ObjectId = require('../../common/services/mongoose.service').mongoose.Types.ObjectId

exports.createEventTeams = (req, res) => {

    let teams = []

    try{
        req.body.teams.forEach(element => {
            let team = {};
            
            team.eventId = ObjectId(req.params.eventId)
            team.open1 = ObjectId(element.open1)
            team.open2 = ObjectId(element.open2)
            team.opposite = ObjectId(element.opposite)
            team.mid1 = ObjectId(element.mid1)
            team.mid2 = ObjectId(element.mid2)
            team.setter = ObjectId(element.setter)
            if(element.libero) team.libero = ObjectId(element.libero)
            teams.push(team)
        });
    } catch (error) {
        console.log("try error: ", error)
        res.status(400).send(error)
    }

    TeamModel.insertMany(teams)
        .then((result) => {
            res.status(201).send({result:result});
        }).catch((e) => {
            res.status(400).send(e)
            //res.status(400).send({error: e.name})
        });
};

exports.listEventTeams = (req, res) => {
    if(req.query.populate==='true'){
        TeamModel.getEventTeamsPopulated(req.params.eventId).then((results) => {
            res.status(200).send(results)
        }).catch((error) => {
            res.status(400).send(error)
        })
    }
    else{
        TeamModel.getEventTeams(req.params.eventId).then((results) => {
            res.status(200).send(results)
        }).catch((error) => {
            res.status(400).send(error)
        })
    }
};

exports.deleteEventTeams = (req, res, next) => {
    TeamModel.deleteMany(req.params.eventId)
    .then((result) => {
        next()
    }).catch((e) => {
        res.status(400).send(e)
    })
}

exports.cancelTeam = (req, res) => {
    req.body.status = "canceled"

    TeamModel.patchTeam(req.params.teamId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

