const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required : true
    },
    firstName: String,
    lastName: String,
    email: String,
    password: {
        type: String,
        required : true
    },
    sex: String,
    birthday: Date,
    positionPreference: [mongoose.Types.ObjectId],
    permissionLevel: Number
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true
});

// userSchema.findById = function (cb) {
//     return this.model('Users').find({id: this.id}, cb);
// };

const User = mongoose.model('Users', userSchema);


exports.findByEmail = (email) => {
    return User.find({email: email});
};

exports.findByEmailOrUsername = (email = null, username = null) =>{
    if(email){
        return User.find({email: email})
    }
    else if(username){
        return User.find({username: username})
    }
    
}
exports.findById = (id) => {
    return User.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            delete result.password;
            delete result.permissionLevel;
            return result;
        });
};

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

// Used by admin
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .select("-password")
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.patchUser = (id, userData) => {
    return User.findOneAndUpdate({
        _id: id
    }, userData);
};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.deleteMany({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

