var node = require('../db/schems/node');
var unique = require('array-unique');

module.exports = function (io, socket) {
    socket.on('responseGPSNodeData', function (data) {
        console.log('[CLIENT_RESPONSE] event : responseGPSNodeData, ' + JSON.stringify(data));

        function onError(err) {
            console.error(err);
        }

        function findNode() {
            var findQuery;
            if(data.sectionName == '전체'){
                findQuery = {};
            }else{
                findQuery = {
                    sectionName : data.sectionName
                }
            }
            //console.log(findQuery);
            return node.find(findQuery).exec();
        }

        function handleResult(result) {
            io.to(socket.id).emit('responseGPSNodeData', {
                list : result
            });
        }

        return findNode()
            .then(handleResult)
            .catch(onError);
    });
}