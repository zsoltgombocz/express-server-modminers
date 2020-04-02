const mongoose = require('mongoose');

const KeysSchema = mongoose.Schema({
    key: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Keys', KeysSchema)