var node = require('../db/schems/node');

module.exports = function (io, socket) {
    socket.on('changeNodeStatus', function (data) {
        console.log('[CLIENT_RESPONSE] event : changeNodeStatus');
        var nodeID = data.nodeID;
        var status = data.status;
        var tag = data.tag;

        function updateNodeDocument() {
            var findQuery = {
                nodeID : nodeID,
            }
            var updateQuery = {
                status : status,
                tag : tag
            }
            return node.update(findQuery, updateQuery).exec();
        }

        return updateNodeDocument();
    })
};