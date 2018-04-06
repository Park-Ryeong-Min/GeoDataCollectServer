var node = require('../db/schems/node');

module.exports = function (io, socket) {
    socket.on('removeNodeByID', function (data) {

        // required params
        var nodeID = data.nodeID;

        function onError(err) {
            console.error(err);
        }

        function removeNodeByNodeID() {
            return node.remove({nodeID : nodeID}).exec();
        }

        function handleResult(result) {
            console.log(result);
            if(result.nRemoved == 1){
                io.to(socket.id).emit('removeNodeResult', {
                    result : 1
                });
            }else{
                io.to(socket.id).emit('removeNodeResult', {
                    result : 0
                });
            }
        }

        return removeNodeByNodeID()
            .then(handleResult)
            .catch(onError);
    });
}