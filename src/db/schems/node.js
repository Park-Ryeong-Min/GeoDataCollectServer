var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var schema = mongoose.Schema;
var schemaType = mongoose.Schema.Types;

var node = new schema({
    ID : Number,
    longitude : schemaType.Double,
    latitude : schemaType.Double,
    adjacent : [],
    tag : String,
    status : Number
});

node.plugin(autoIncrement.plugin, {
    model : 'node',
    field : 'ID',
    startAt : 0,
    incrementBy : 1,
});
module.exports = mongoose.model('node', node, 'node');
