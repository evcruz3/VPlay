const TeamModel = require('../models/teams.model');
const config = require('../../common/config/env.config')
const ADMIN_PERMISSION = config['permissionLevels']['ADMIN'];
const season = config.season
const ObjectId = require('../../common/services/mongoose.service').mongoose.Types.ObjectId

exports.insert = (req, res) => {
    TeamModel.createTeam(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
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

exports.cancelTeam = (req, res) => {
    req.body.status = "canceled"

    TeamModel.patchTeam(req.params.teamId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

