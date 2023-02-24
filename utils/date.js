const moment = require("moment");

/*
 * Return actual time and date -3 hours - Formatted for use with SNCF API (i.e. 20230201T012050)
 */
function getSubtractedCurrentTime() {
    return moment().subtract(3, 'hours').format('YYYYMMDDTHHmmss')
}

module.exports = { getSubtractedCurrentTime }