var node = require('../db/schems/node');

module.exports = function (io, socket) {
    socket.on('changeNodeTag', function (data) {

        // required params
        var nodeID = data.nodeID;
        var tag = data.tag;

        function onError(err) {
            console.error(err);
        }

        function updateNodeDocument() {
            var findQuery = {
                nodeID : nodeID
            };
            var updateQuery = {
                $set : {
                    tag : tag
                }
            };
            return node.update(findQuery, updateQuery).exec();
        }

        function handleResult(result) {
            if(result.n == 1 && result.ok == 1){
                if(result.nModified == 1){
                    io.to(socket.id).emit('tagUpdateResult', {
                        result : 1,
                        tag : tag
                    });
                }else{
                    io.to(socket.id).emit('tagUpdateResult', {
                        result : 2,
                        tag : tag
                    });
                }
            }else{
                io.to(socket.id).emit('tagUpdateResult', {
                    result : 0,
                    tag : tag
                });
            }
        }

        return updateNodeDocument()
            .then(handleResult)
            .catch(onError);
    });
}