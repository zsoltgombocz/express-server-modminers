const mongoose = require('mongoose');

const LogsSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now(),
        require: true
    },
    user_id: {
        type: String,
        require: true
    },
    message: {
        type: String,
        reqiure: true
    },
    variant: {
        type: String,
        require: true,
        default: ""
    },
    seen: {
        type: Boolean,
        require: true,
        default: true
    }
});

module.exports = mongoose.model('Logs', LogsSchema)