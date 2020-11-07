const { hexBlock } = require('./hex-block');

function createBuildId() {
    return hexBlock(Date.now(), 11);
}
module.exports.createBuildId = createBuildId;
