const ReservationModel = require('../models/reservations.model');
const config = require('../../common/config/env.config')
const ADMIN_PERMISSION = config['permissionLevels']['ADMIN'];
const season = config.season
const ObjectId = require('../../common/services/mongoose.service').mongoose.Types.ObjectId

exports.insert = (req, res) => {
    ReservationModel.createReservation(req.body)
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
    let query;
    
    query = {eventId:ObjectId(req.params.eventId)}

    if (req.query.groupId) query.groupId = req.query.groupId; // groupId is not an ObjectId
    if (req.query.reservationId) query._id = ObjectId(req.query.reservationId);

    if (req.query.grouped && req.query.grouped === 'true'){
        ReservationModel.groupedList(limit, page, query)
        .then((result) => {
            res.status(200).send(result)
        }).catch((err) => {
            res.status(400).send(err)
        })
    }
    else{
        ReservationModel.list(limit, page, query)
        .then((result) => {
            res.status(200).send(result);
        })
    }
        
};

exports.listUserReservations = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    let query;

    query = {playerId:ObjectId(req.params.userId)}

    if (req.query.populate === 'true') {
        ReservationModel.listPopulated(limit, page, query)
        .then((result) => {
            res.status(200).send(result)
        }).catch((err) => {
            res.status(400).send(err)
        })
    }
    else{
        ReservationModel.list(limit, page, query)
        .then((result) => {
            res.status(200).send(result);
        })
    }
}

exports.cancelReservation = (req, res) => {
    req.body.status = "canceled"
    let userId = ObjectId(req.jwt.userId)
    let eventId = ObjectId(req.params.eventId)

    ReservationModel.patchReservation(eventId, userId, req.body)
        .then((result) => {
            if(result)
                res.status(200).send();
            else
                res.status(200).send({error: "you are not reserved for this event"});
        });

};

exports.deleteReservation = (req, res) => {
    ReservationModel.removeById(req.params.reservationId)
    .then((result) => {
        res.status(204).send()
    }).catch((err) => {
        res.status(404).send()
    });
}

exports.patchReservation = (req, res) => {
    ReservationModel.patchById(req.params.reservationId, req.body)
    .then((result) => {
        res.status(204).send()
    })
}

