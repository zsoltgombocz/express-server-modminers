const mongoose = require('mongoose');

const SkinSchema = mongoose.Schema({
    sex: {
        type: Number,
        require: true
    },
    id: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model('Skins', SkinSchema)