const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const positionPreferenceSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required : true
    },
    gameType: {
        type: String,
        enum: ['rated', 'unrated', 'custom'],
        required: true
    },
    positionOrder: [{
        type: String,
        enum: ['open','opposite','middle','setter','libero'],
        required: true
    }]
});

positionPreferenceSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
positionPreferenceSchema.set('toJSON', {
    virtuals: true
});

// positionPreferenceSchema.findById = function (cb) {
//     return this.model('PositionPreferences').find({id: this.id}, cb);
// };

const PositionPreference = mongoose.model('PositionPreferences', positionPreferenceSchema);

exports.findById = (id) => {
    return PositionPreference.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            delete result.password;
            delete result.permissionLevel;
            return result;
        });
};

exports.createPositionPreference = (positionPreferenceData) => {
    const positionPreference = new PositionPreference(positionPreferenceData);
    return positionPreference.save();
};

// Used by admin
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        PositionPreference.find()
            .select("-password")
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, positionPreferences) {
                if (err) {
                    reject(err);
                } else {
                    resolve(positionPreferences);
                }
            })
    });
};

exports.patchPositionPreference = (id, positionPreferenceData) => {
    return PositionPreference.findOneAndUpdate({
        _id: id
    }, positionPreferenceData);
};

exports.removeById = (positionPreferenceId) => {
    return new Promise((resolve, reject) => {
        PositionPreference.deleteMany({_id: positionPreferenceId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

