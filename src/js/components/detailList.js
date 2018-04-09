const tmpl = require('../commons').detailList;

/**
 * Widget for a simple bullet point list with key/value entries
 * @type {module.DetailList}
 */
module.exports = class DetailList {
    constructor(title, properties) {
        return $(tmpl({
            title: title,
            properties: properties
        }));
    }
};
