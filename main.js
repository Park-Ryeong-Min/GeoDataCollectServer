console.log('Server for collecting Geo Data');

var sysConfig = require('./src/Configures/system');

var app = require('express')();
var server  = require('http').createServer(app);

require('./src/db/connect/connect');

var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('[CLIENT_CONNECT] connected with ' + socket.id);

    require('./src/socket.event/ping')(io, socket);
    require('./src/socket.event/getGPSNodeData')(io, socket);
    require('./src/socket.event/responseGPSNodeNumber')(io, socket);
    require('./src/socket.event/responseGPSNodeData')(io, socket);
    require('./src/socket.event/removeSectionByName')(io, socket);
    require('./src/socket.event/changeNodeStatus')(io, socket);
    require('./src/socket.event/changeNodeTag')(io, socket);
    require('./src/socket.event/removeNodeByID')(io, socket);
});

server.listen(sysConfig.PORT, function () {
    console.log('Socket server created for collecting Geo data.');
});
