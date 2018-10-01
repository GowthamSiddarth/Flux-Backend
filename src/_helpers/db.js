const config = require('../config/db.config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connection_string);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
}