var node = require('../db/schems/node');
var getDistance = require('geolib').getDistance;

module.exports = function (io, socket) {
    socket.on('addAdjacentNode', function (data) {
        console.log('[CLIENT_RESPONSE] event : addAdjacentNode');

        // required params
        var addNodeID = data.addNodeID;
        var curNodeID = data.curNodeID;

        // local variables
        var addNodeLat;
        var addNodeLng;
        var curNodeLat;
        var curNodeLng;
        var distance;

        function onError(err) {
            console.error(err);
        }

        function findAddNode() {
            return node.findOne({nodeID : addNodeID}).exec();
        }

        function handleFindAddNodeResult(result) {
            addNodeLat = result.latitude;
            addNodeLng = result.longitude;
            return node.findOne({nodeID : curNodeID}).exec();
        }

        function handleFindCurNodeResult(result) {
            curNodeLat = result.latitude;
            curNodeLng = result.longitude;
            var addNode = {
                latitude : addNodeLat,
                longitude : addNodeLng
            };
            var curNode = {
                latitude : curNodeLat,
                longitude : curNodeLng
            }
            distance = getDistance(addNode, curNode);
            console.log('[GET_DISTANCE] distance : ' + distance);
            return new Promise(function (resolve, reject) {
                resolve();
            })
        }

        function updateNodeDocument() {
            var findQuery = {
                nodeID : curNodeID
            }
            var updateQuery = {
                $push : {
                    adjacent : {
                        nodeID : addNodeID,
                        latitude : addNodeLat,
                        longitude : addNodeLng,
                        distance : distance
                    }
                }
            }
            return node.update(findQuery, updateQuery).exec();
        }

        return findAddNode()
            .then(handleFindAddNodeResult)
            .then(handleFindCurNodeResult)
            .then(updateNodeDocument)
            .catch(onError);
    });
}