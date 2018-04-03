var node = require('../db/schems/node');
var unique = require('array-unique');

module.exports = function (io, socket) {
    socket.on('responseGPSNodeNumber', function (data) {
        console.log('[CLIENT_RESPONSE] event : responseGPSNodeNumber');

        function onError(err) {
            console.error(err);
        }

        function findNode() {
            return node.find().exec();
        }

        function handleResult(result) {
            var numberList = [];
            for(var i = 0; i < result.length; i++){
                numberList.push(result[i].sectionName);
            }
            return new Promise(function (resolve, reject) {
                resolve(unique(numberList));
            })
        }

        function sendResponse(result) {
            io.to(socket.id).emit('responseGPSNodeNumber', {
                list : result
            })
        }

        return findNode()
            .then(handleResult)
            .then(sendResponse)
            .catch(onError);
    });
}