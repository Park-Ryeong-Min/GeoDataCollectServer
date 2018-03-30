module.exports = function (io, socket) {
    socket.on('ping', function (data) {
        console.log('[FromCLIENT] ping - pong');
        io.to(socket.id).emit('pong', {
            result : 10,
            message : 'ping-pong with server and client'
        });
    });
}