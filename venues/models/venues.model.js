const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const venueSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    author: {
        type: ObjectId,
        required: true,
        ref: 'Users'
    },
    tags: [String]
});


venueSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
venueSchema.set('toJSON', {
    virtuals: true
});

const Venue = mongoose.model('Venues', venueSchema);

exports.find = (query) => {
    return Venue.find(query)
        .then((result) => {
            result = result.toJSON();
            return result
        });
};

exports.checkIfExisting = (query) => {
    return new Promise((resolve, reject) => {
        Venue.exists((query), function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    });
}

exports.list = (perPage, page, query) => {
    return new Promise((resolve, reject) => {
        Venue.find(query)
            .select()
            .sort({_id:-1})
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, venues) {
                if (err) {
                    reject(err);
                } else {
                    resolve(venues);
                }
            })
    });
};

exports.findById = (id) => {
    return Venue.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createVenue = (venueData) => {
    const event = new Venue(venueData);
    return event.save();

}
exports.insertMany = (venues) => {
    return new Promise((resolve, reject) => {
        Venue.insertMany(venues, function (err, venue){
            if(err) {
                reject(err)
            } else {
                resolve(venues)
            }
        })
    })
}

exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        Venue.deleteMany({_id: id}, (err) => {
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