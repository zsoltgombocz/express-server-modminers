const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        minlength: 4,
        maxlength: 64
    },
    password: {
        password: {
            type: String,
            require: true,
            minlength: 11,
            maxlength: 64
        },
        request: {type: Boolean, default: false},
        password_code: {type: String, default: ""},
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
    sex: {
        type: Number,
        required: true,
        default: 0
    },
    skin: {
        type: Number,
        required: true,
        default: 0
    },
    permissions: {
        verified: {type: Number, default: 0, require:true},
        admin: {type: Boolean, default: false, require:true},
        server: {type: Number, default: 0, require:true},
        skin: {type: Boolean, default: true, require:true}
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
    },
    logout: {
        type: Boolean,
        require: false
    }

}, { retainKeyOrder: true });

module.exports = mongoose.model("User", UserSchema);