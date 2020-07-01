const mongoose = require('mongoose');

const SkillSchema = mongoose.Schema({
    r_name: {
        type: String,
        require: true
    },
    d_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    required: {
        type: String,
        default: ""
    },
    group: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Skills', SkillSchema)