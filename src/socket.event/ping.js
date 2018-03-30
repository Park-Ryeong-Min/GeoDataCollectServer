module.exports = function (io, socket) {
    socket.on('ping', function (data) {
        io.to(socket.id).emit('pong', {
            result : 10,
            message : 'ping-pong with server and client'
        });
    })
}