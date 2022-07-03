const mongoose = require('../../common/services/mongoose.service').mongoose;
const User = require('../../users/models/users.model').User
const Event = require('../models/events.model').Event
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const teamSchema = new Schema({
    eventId: {
        type: ObjectId,
        required: true,
        ref: 'Events'
    },
    open1: {
        type: ObjectId,
        required: true,
        ref: 'Users'
    },
    open2: {
        type: ObjectId,
        required: true,
        ref: 'Users'
    },
    opposite: {
        type: ObjectId,
        required: true,
        ref: 'Users'
    },
    mid1: {
        type: ObjectId,
        required: true,
        ref: 'Users'
    },
    mid2: {
        type: ObjectId,
        required: true,
        ref: 'Users'
    },
    setter: {
        type: ObjectId,
        required: true,
        ref: 'Users'
    },
    libero: {
        type: ObjectId,
        ref: 'Users'
    }
});

teamSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
teamSchema.set('toJSON', {
    virtuals: true
});

const Team = mongoose.model('Teams', teamSchema);

exports.insertMany = (teams) => {
    return new Promise((resolve, reject) => {
        //const newDoc = new Schedule(document)
        Team.insertMany(teams, function (err, teams){
            if(err) {
                reject(err)
            } else {
                resolve(teams)
            }
        })
    })
}

exports.findById = (id) => {
    return Event.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.checkIfExisting = (query) => {
    return new Promise((resolve, reject) => {
        Team.exists((query), function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}

exports.getEventTeams = (eventId) => {
    return new Promise((resolve, reject) => {
        Team.find({eventId: ObjectId(eventId)})
            .select("-eventId -id")
            .lean()
            .exec(function (err, teams) {
                if (err) {
                    reject(err);
                } else {
                    resolve(teams);
                }
            })
    });
}

exports.deleteMany = (eventId) => {
    return new Promise((resolve, reject) => {
        Team.deleteMany({eventId:ObjectId(eventId)})
        .exec(function (err, schedule){
            if(err) {
                reject(err)
            } else {
                resolve(schedule)
            }
        })
    })
}

exports.getEventTeamsPopulated = (eventId) => {
    return new Promise((resolve, reject) => {
        Team.find({eventId: ObjectId(eventId)})
            .select("-id -eventId")
            .lean()
            .populate(
                {path:"open1 open2 opposite mid1 mid2 setter libero", 
                select:'username'})
            .exec(function (err, teams) {
                if (err) {
                    reject(err);
                } else {
                    resolve(teams);
                }
            })
    });
}


