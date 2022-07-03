const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const reservationSchema = new Schema({
    positionPreference: {
        type: [String],
        enum: ['open','opposite','middle','setter','libero'],
        required: true
    },
    playerId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    status: {
        type: String,
        enum: ['waiting','granted','canceled','not granted'],
        required: true
    },
    eventId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Events'
    },
    groupId: {
        type: String,
        required: true
    }
});

reservationSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
reservationSchema.set('toJSON', {
    virtuals: true
});

const Reservation = mongoose.model('Reservations', reservationSchema);

exports.findByName = (name) => {
    return Reservation.find({name: name});
};

exports.findByHostAndId = (hostId, reservationId) => {
    return new Promise((resolve, reject) => {
        Reservation.find({_id: ObjectId(reservationId), host: ObjectId(hostId)})
            .exec(function (err, reservations) {
                if (err) {
                    reject(err);
                } else {
                    resolve(reservations);
                }
            })
    });
}

exports.findById = (id) => {
    return Reservation.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createReservation = (reservationData) => {
    const reservation = new Reservation(reservationData);
    return reservation.save();
};

// Used by admin
exports.list = (perPage, page, query) => {
    return new Promise((resolve, reject) => {
        Reservation.find(query)
            .select()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, reservations) {
                if (err) {
                    reject(err);
                } else {
                    resolve(reservations);
                }
            })
    });
};

exports.groupedList = (perPage, page, query) => {
    return new Promise((resolve, reject) => {
        Reservation.aggregate([
            {
                $match: query
            },
            {
                $skip: perPage*page
            },
            {
                $limit: perPage
            },
            {
                $sort: {
                    "_id": -1
                }
            },
            {
                $group: {
                    "_id": "$groupId",
                    "timestamp" : {"$first" : {"$toDate":"$_id"}},
                    total: {$sum: 1},
                    reservations: {
                        // $push: "$$ROOT"
                        $push: {
                            "positionPreference": "$positionPreference",
                            "playerId": "$playerId",
                            "status": "$status"
                        }
                    }
                }
            }
        ], function(err, results){
            if(err)
                reject(err)
            else
                resolve(results)
        })
    });
}

exports.find = (perPage, page, query) => {
    return new Promise((resolve, reject) => {
        Reservation.find(query)
            .select("-__v -id")
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
    });
};

exports.checkIfExisting = (query) => {
    return new Promise((resolve, reject) => {
        Reservation.exists((query), function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    });
}

exports.patchReservation = (id, reservationData) => {
    return Reservation.findOneAndUpdate({
        _id: id
    }, reservationData);
};

exports.removeById = (reservationId) => {
    return new Promise((resolve, reject) => {
        Reservation.deleteMany({_id: reservationId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

