var node = require('../db/schems/node');

module.exports = function (io, socket) {
    socket.on('getGPSNodeData', function (data) {
        console.log('[FromCLIENT] event : getGPSNodeData, ' + JSON.stringify(data));

        var lng = data.longitude;
        var lat = data.latitude;
        var sectionNumber = data.sectionNumber;
        var sectionName = data.sectionName;

        function saveNewNode() {
            var newNode = new node();
            newNode.longitude = lng;
            newNode.latitude = lat;
            newNode.sectionNumber = sectionNumber;
            newNode.sectionName = sectionName;

            return newNode.save();
        }
        
        function handleResult(result) {
            var response = {
                ID : result.ID,
                longitude : result.longitude,
                latitude : result.latitude
            };
            io.to(socket.id).emit('saveResult', response);
        }

        function onError(err) {
            console.error(err);
        }

        return saveNewNode()
            .then(handleResult)
            .catch(onError);
    });
}