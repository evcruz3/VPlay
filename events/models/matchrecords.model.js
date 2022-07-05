const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const matchRecordSchema = new Schema({
    scheduleId: {
        type: ObjectId,
        required: true,
        ref: 'Schedules'
    },
    win_team : {
        open1: {type: ObjectId, ref: 'Users', required: true},
        open2: {type: ObjectId, ref: 'Users', required: true},
        opposite: {type: ObjectId, ref: 'Users', required: true},
        mid1: {type: ObjectId, ref: 'Users', required: true},
        mid2: {type: ObjectId, ref: 'Users', required: true},
        setter: {type: ObjectId, ref: 'Users', required: true},
        libero: {type: ObjectId, ref: 'Users'}
    },
    lose_team : {
        open1: {type: ObjectId, ref: 'Users', required: true},
        open2: {type: ObjectId, ref: 'Users', required: true},
        opposite: {type: ObjectId, ref: 'Users', required: true},
        mid1: {type: ObjectId, ref: 'Users', required: true},
        mid2: {type: ObjectId, ref: 'Users', required: true},
        setter: {type: ObjectId, ref: 'Users', required: true},
        libero: {type: ObjectId, ref: 'Users'}
    },
    win_score : {
        type: Number,
        required: true
    },
    lose_score : {
        type: Number,
        required: true
    },
    eventId: {
        type: ObjectId,
        required: true,
        ref: 'Events'
    },
    status: {
        type: String,
        enum: ['canceled', 'finished'],
        required: true
    }
});


matchRecordSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
matchRecordSchema.set('toJSON', {
    virtuals: true
});

const MatchRecord = mongoose.model('MatchRecords', matchRecordSchema);

exports.find = (query) => {
    return MatchRecord.find(query)
        .then((result) => {
            result = result.toJSON();
            return result
        });
};

exports.findById = (id) => {
    return MatchRecord.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.deleteMany = (eventId) => {
    return new Promise((resolve, reject) => {
        MatchRecord.deleteMany({eventId:ObjectId(eventId)})
        .exec(function (err, matchRecord){
            if(err) {
                reject(err)
            } else {
                resolve(matchRecord)
            }
        })
    })
}

exports.createMatchRecord = (matchRecordData) => {
    const event = new MatchRecord(matchRecordData);
    return event.save();
}
exports.insertMany = (matchRecords) => {
    return new Promise((resolve, reject) => {
        //const newDoc = new MatchRecord(document)
        MatchRecord.insertMany(matchRecords, function (err, matchRecord){
            if(err) {
                reject(err)
            } else {
                resolve(matchRecords)
            }
        })
    })
}

exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        MatchRecord.deleteMany({_id: id}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

exports.patchById = (id, data) => {
    return Event.findOneAndUpdate({
        _id: id
    }, data);
};