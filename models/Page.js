const mongoose = require('mongoose');

const PageSchema = mongoose.Schema({
    game: {
        type: Boolean,
        require: true
    }
});

module.exports = mongoose.model('Page', PageSchema)