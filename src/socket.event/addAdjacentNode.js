var node = require('../db/schems/node');
var geo = require('geolib');

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

        function deg2rad(deg) {
            return deg * (Math.PI/180)
        }

        function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2-lat1);  // deg2rad below
            var dLon = deg2rad(lon2-lon1);
            var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c; // Distance in km
            return d;
        }

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
            //distance = geo.getDistanceSimple(addNode, curNode);
            distance = getDistanceFromLatLonInKm(addNodeLat, addNodeLng, curNodeLat, curNodeLng);
            console.log('[GET_DISTANCE] distance : ' + distance);
            return new Promise(function (resolve, reject) {
                resolve();
            })
        }

        function updateCurNodeDocument() {
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

        function updateAddNodeDocument(result) {
            var findQuery = {
                nodeID : addNodeID
            }
            var updateQuery = {
                $push : {
                    adjacent : {
                        nodeID : curNodeID,
                        latitude : curNodeLat,
                        longitude : curNodeLng,
                        distance : distance
                    }
                }
            }
            return node.update(findQuery, updateQuery).exec();
        }

        return findAddNode()
            .then(handleFindAddNodeResult)
            .then(handleFindCurNodeResult)
            .then(updateCurNodeDocument)
            .then(updateAddNodeDocument)
            .catch(onError);
    });
}