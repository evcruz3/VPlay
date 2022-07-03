const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const scheduleSchema = new Schema({
    eventId: {
        type: ObjectId,
        required: true,
        ref: 'Events'
    },
    gameNumber: {
        type: Number,
        required: true
    },
    teamA: {
        type: ObjectId,
        required: true,
        ref: 'Teams'
    },
    teamB: {
        type: ObjectId,
        required: true,
        ref: 'Teams'
    }
});


scheduleSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
scheduleSchema.set('toJSON', {
    virtuals: true
});

const Schedule = mongoose.model('Schedules', scheduleSchema);

exports.findByEventId = (eventId) => {
    return Schedule.find({eventId: ObjectId(eventId)});
};

exports.findById = (id) => {
    return Schedule.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.deleteMany = (eventId) => {
    return new Promise((resolve, reject) => {
        Schedule.deleteMany({eventId:ObjectId(eventId)})
        .exec(function (err, schedule){
            if(err) {
                reject(err)
            } else {
                resolve(schedule)
            }
        })
    })
}
exports.insertMany = (schedule) => {
    return new Promise((resolve, reject) => {
        //const newDoc = new Schedule(document)
        Schedule.insertMany(schedule, function (err, schedule){
            if(err) {
                reject(err)
            } else {
                resolve(schedule)
            }
        })
    })
}

exports.getEventSchedulePopulated = (eventId) => {
    return new Promise((resolve, reject) => {
        Schedule.find({eventId: ObjectId(eventId)})
            .select("-id -eventId")
            .lean()
            .populate({
                path: "teamA teamB",
                select: "-eventId",
                populate : {
                    path: "open1 open2 opposite mid1 mid2 setter libero",
                    select: "username"
                },
                options: {lean:true}
            })
            .exec(function (err, teams) {
                if (err) {
                    reject(err);
                } else {
                    //teams.subPopulate('teams')
                    resolve(teams);
                }
            })
    });
}

exports.getEventSchedule = (eventId) => {
    return new Promise((resolve, reject) => {
        Schedule.find({eventId: ObjectId(eventId)})
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