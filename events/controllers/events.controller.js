const EventModel = require('../models/events.model');
const crypto = require('crypto');
const ADMIN_PERMISSION = require('../../common/config/env.config')['permissionLevels']['ADMIN'];

exports.insert = (req, res) => {
    EventModel.createEvent(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        }).catch((e) => {
            res.status(400).send(e)
            //res.status(400).send({error: e.name})
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    EventModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    EventModel.findById(req.params.eventId)
        .then((result) => {
            res.status(200).send(result);
        });
};
exports.patchById = (req, res) => {

    // Host may modify the event except for the following:
    
    let user_permission_level = parseInt(req.jwt.permissionLevel);

    if (!(user_permission_level >= ADMIN_PERMISSION)) {
        req.body.type ? delete req.body.type : '';
        req.body.status ? delete req.body.status : '';
        req.body.host ? delete req.body.host : '';
        req.body.season ? delete req.body.season : '';
    }

    EventModel.patchEvent(req.params.eventId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    EventModel.removeById(req.params.eventId)
        .then((result)=>{
            res.status(204).send({});
        });
};
