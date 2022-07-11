const VenueModel = require('../models/venues.model');
const config = require('../../common/config/env.config')
const ADMIN_PERMISSION = config['permissionLevels']['ADMIN'];
const season = config.season
const ObjectId = require('../../common/services/mongoose.service').mongoose.Types.ObjectId

exports.insert = (req, res) => {
    req.body.author = ObjectId(req.jwt.userId)
    VenueModel.createVenue(req.body)
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

    let query = {}

    if(req.query.author)
        query.author = ObjectId(req.query.author)
    
    VenueModel.list(limit, page, query)
        .then((result) => {
            res.status(200).send(result);
        })
        
};

exports.getById = (req, res) => {
    VenueModel.findById(req.params.venueId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.deleteVenue = (req, res) => {
    VenueModel.removeById(req.params.venueId)
    .then((result) => {
        res.status(204).send()
    }).catch((err) => {
        res.status(404).send()
    });
}

exports.patchVenue = (req, res) => {
    VenueModel.patchById(req.params.venueId, req.body)
    .then((result) => {
        res.status(204).send()
    })
}

