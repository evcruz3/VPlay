const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const matchStatSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required : true
    },
    season: {
        type: Number,
        required : true
    },
    type: {
        type: String,
        enum: ['rated', 'unrated'],
        required: true
    },
    matchWon: {
        type: Number,
        required: true
    },
    matchLost: {
        type: Number,
        required: true
    },
    pointsWon: {
        type: Number,
        required: true
    },
    pointsLost: {
        type: Number,
        required: true
    }
});

matchStatSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
matchStatSchema.set('toJSON', {
    virtuals: true
});

// matchStatSchema.findById = function (cb) {
//     return this.model('MatchStats').find({id: this.id}, cb);
// };

const MatchStat = mongoose.model('MatchStats', matchStatSchema);

exports.findById = (id) => {
    return MatchStat.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.removeUserMatchStats = (userId) => {
    return new Promise((resolve, reject) => {
        MatchStat.deleteMany({userId : mongoose.Types.ObjectId(userId)})
        .then(function(res){
            resolve(res)
        }).catch(function(error){
            console.log(error)
            reject(error);
        });
    });
}

exports.find = (query) => {
    return new Promise((resolve, reject) => {
        MatchStat.find(query)
            .select()
            .exec(function (err, matchStats) {
                if (err) {
                    reject(err);
                } else {
                    resolve(matchStats);
                }
            })
    });
}

exports.createMatchStat = (matchStatData) => {
    const matchStat = new MatchStat(matchStatData);
    return matchStat.save();
};

// Used by admin
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        MatchStat.find()
            .select("-password")
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, matchStats) {
                if (err) {
                    reject(err);
                } else {
                    resolve(matchStats);
                }
            })
    });
};

exports.patchMatchStat = (id, matchStatData) => {
    return MatchStat.findOneAndUpdate({
        _id: id
    }, matchStatData);
};

exports.removeById = (matchStatId) => {
    return new Promise((resolve, reject) => {
        MatchStat.deleteMany({_id: matchStatId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

