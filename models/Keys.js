const mongoose = require('mongoose');

const KeysSchema = mongoose.Schema({
    key: {
        type: String,
        require: true
    },
    permanent: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Keys', KeysSchema)