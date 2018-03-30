var mongoose = require('mongoose');

var config = {
    URI : 'mongodb://localhost:27017/geo'
}

mongoose.connect(config.URI);
const db = mongoose.connection;

db.on('error', console.error);
db.once('open', function () {
    console.log('Connected to mongodb server in localhost with PORT 27017');
});

module.exports = db;