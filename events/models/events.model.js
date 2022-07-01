const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const eventSchema = new Schema({
    name: String,
    description: String,
    type: {
        type: String,
        enum: ['rated', 'unrated', 'custom'],
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'ongoing', 'canceled', 'finished', 'locked'],
        required: true
    },
    maxTeam : {
        type: Number,
        min: 2
    },
    pricePerPlayer : Number,
    libero : {
        type: Boolean,
        required: true,
    },
    date: {
        type: Date,
        required : true
    },
    venue : mongoose.Types.ObjectId,
    host : {
        type: mongoose.Types.ObjectId,
        required : true
    },
    season : {
        type: Number,
        required: true
    }
});

eventSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
eventSchema.set('toJSON', {
    virtuals: true
});

const Event = mongoose.model('Events', eventSchema);


exports.findByName = (name) => {
    return Event.find({name: name});
};

exports.findByHostAndId = (hostId, eventId) => {
    return new Promise((resolve, reject) => {
        Event.find({_id: ObjectId(eventId), host: ObjectId(hostId)})
            .exec(function (err, events) {
                if (err) {
                    reject(err);
                } else {
                    resolve(events);
                }
            })
    });
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

exports.createEvent = (eventData) => {
    const event = new Event(eventData);
    return event.save();
};

// Used by admin
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Event.find()
            .select()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, events) {
                if (err) {
                    reject(err);
                } else {
                    resolve(events);
                }
            })
    });
};

exports.patchEvent = (id, eventData) => {
    return Event.findOneAndUpdate({
        _id: id
    }, eventData);
};

exports.removeById = (eventId) => {
    return new Promise((resolve, reject) => {
        Event.deleteMany({_id: eventId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

