const MatchStatModel = require('../models/matchstats.model');
const crypto = require('crypto');
const { query } = require('express');
const ADMIN_PERMISSION = require('../../common/config/env.config')['permissionLevels']['ADMIN'];
const ObjectId = require('../../common/services/mongoose.service').mongoose.Types.ObjectId;

exports.removeUserMatchStats = (req, res, next) => {
    MatchStatModel.removeUserMatchStats(req.params.userId).then((result) => {
        next()
    }).catch((err) => {
        res.status(404).send(err)
    })
}

exports.find = (req, res) => {
    let query = {userId : ObjectId(req.params.userId)};

    if(req.query.season) query.season = req.query.season;
    if(req.query.type) query.type = req.query.type;

    console.log(query)
    MatchStatModel.find(query)
        .then((result) => {
            res.status(200).send(result);
        });
};

// Not sure if needed
exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    MatchStatModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

// Not sure if needed
exports.getById = (req, res) => {
    MatchStatModel.findById(req.params.matchstatId)
        .then((result) => {
            res.status(200).send(result);
        });
};

// Not sure if needed
exports.patchById = (req, res) => {
    let matchstat_permission_level = parseInt(req.jwt.permissionLevel);

    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    if (!(matchstat_permission_level & ADMIN_PERMISSION)) {
        if(req.body.permissionLevel){
            delete req.body.permissionLevel
        }
    }

    MatchStatModel.patchMatchStat(req.params.matchstatId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

// Not sure if needed
exports.removeById = (req, res) => {
    MatchStatModel.removeById(req.params.matchstatId)
        .then((result)=>{
            res.status(204).send({});
        });
};