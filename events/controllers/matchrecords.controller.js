const MatchRecordModel = require('../models/matchrecords.model');
const config = require('../../common/config/env.config')
const ADMIN_PERMISSION = config['permissionLevels']['ADMIN'];
const season = config.season
const ObjectId = require('../../common/services/mongoose.service').mongoose.Types.ObjectId

exports.createMatchRecord = (req, res) => {

    req.body.eventId = req.params.eventId

    MatchRecordModel.createMatchRecord(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        }).catch((e) => {
            res.status(400).send(e)
            //res.status(400).send({error: e.name})
        });
};

exports.deleteMatchRecord = (req, res) => {
    MatchRecordModel.removeById(req.params.matchRecordId)
    .then((result) => {
        res.status(204).send()
    }).catch((err) => {
        res.status(404).send()
    });
}

exports.patchMatchRecord = (req, res) => {
    MatchRecordModel.patchById(req.params.matchRecordId, req.body)
    .then((result) => {
        res.status(204).send()
    })
}

exports.listEventMatchRecords = (req, res) => {
    let query = {eventId : ObjectId(req.params.eventId)}
    MatchRecordModel.find(query)
        .then((result) => {
            res.status(200).send({result})
        }).catch((error) => {
            res.status(400).send(error)
        })
}

exports.listUserMatchRecords = (req, res) => {
    let userId = ObjectId(req.params.userId)

    let query = {$or : [
        {"win_team.open1" : userId},
        {"win_team.open2" : userId},
        {"win_team.opposite" : userId},
        {"win_team.mid1" : userId},
        {"win_team.mid2" : userId},
        {"win_team.setter" : userId},
        {"win_team.libero" : userId},
        {"lose_team.open1" : userId},
        {"lose_team.open2" : userId},
        {"lose_team.opposite" : userId},
        {"lose_team.mid1" : userId},
        {"lose_team.mid2" : userId},
        {"lose_team.setter" : userId},
        {"lose_team.libero" : userId},
    ]}


    MatchRecordModel.find(query)
        .then((result) => {
            res.status(200).send({result})
        }).catch((error) => {
            res.status(400).send(error)
        })
}

exports.listUserEventMatchRecords = (req, res) => {
    let userId = ObjectId(req.params.userId)
    let eventId = ObjectId(req.params.eventId)

    let query = {eventId : eventId,
        $or : [
            {"win_team.open1" : userId},
            {"win_team.open2" : userId},
            {"win_team.opposite" : userId},
            {"win_team.mid1" : userId},
            {"win_team.mid2" : userId},
            {"win_team.setter" : userId},
            {"win_team.libero" : userId},
            {"lose_team.open1" : userId},
            {"lose_team.open2" : userId},
            {"lose_team.opposite" : userId},
            {"lose_team.mid1" : userId},
            {"lose_team.mid2" : userId},
            {"lose_team.setter" : userId},
            {"lose_team.libero" : userId},
        ]
    }


    MatchRecordModel.find(query)
        .then((result) => {
            res.status(200).send({result})
        }).catch((error) => {
            res.status(400).send(error)
        })
}


