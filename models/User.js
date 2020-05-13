const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 64
    },
    password: {
        request: {type: Boolean, require: true, default: false},
        type: String,
        require: true,
        minlength: 6,
        maxlength: 255
    },
    password_code: {
        type: String, default: ""
    },
    email: {
        email: {
            type: String,
            require: true,
            minlength: 11,
            maxlength: 64
        },
        verified: {type: Boolean, default: false},
        ver_code: {type: String, default: ""},
    },
    description: {
        type: String,
        require: true,
        minlength: 20,
        maxlength: 5000
    },
    permissions: {
        verified: {type: Boolean, default: false, require:true},
        admin: {type: Boolean, default: false, require:true},
        server: {type: Number, default: 0, require:true}
    },
    image: {
        type: String,
        require: true,
        default: ""
    },
    reg_date: {
        type: Date,
        default: Date.now(),
        require: true
    }

}, { retainKeyOrder: true });

module.exports = mongoose.model("User", UserSchema);