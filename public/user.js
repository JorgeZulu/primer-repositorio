const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

UserSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("password")) {
        const document = this;
        bcrypt
            .hash(document.password, saltRounds)
            .then((hashedPassword) => {
                document.password = hashedPassword;
                next();
            })
            .catch((err) => {
                next(err);
            });
    }
});

UserSchema.methods.isCorrectPassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

module.exports = mongoose.model('User', UserSchema);