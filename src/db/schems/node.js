var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var autoIncrement = require('mongoose-auto-increment');
var schema = mongoose.Schema;
var schemaType = mongoose.Schema.Types;

var node = new schema({
    nodeID : Number,
    longitude : {type : schemaType.Double, default : 0.0},
    latitude : {type : schemaType.Double, default : 0.0},
    adjacent : [],
    tag : String,
    status : {type : Number, default : 0},
    sectionNumber : Number,
    sectionName : String
});

autoIncrement.initialize(mongoose.connection);
node.plugin(autoIncrement.plugin, {
    model : 'node',
    field : 'nodeID',
    startAt : 0,
    incrementBy : 1,
});
module.exports = mongoose.model('node', node, 'node');
