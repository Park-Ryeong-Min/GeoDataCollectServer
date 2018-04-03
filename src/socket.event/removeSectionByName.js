var node = require('../db/schems/node');

module.exports = function (io, socket) {
    socket.on('removeSectionByName', function (data) {
        console.log('[CLIENT_RESPONSE] event : removeSectionByName');
        var sectionName = data.sectionName;

        function removeSection() {
            return node.remove({sectionName : sectionName}).exec();
        }

        return removeSection();
    });
}