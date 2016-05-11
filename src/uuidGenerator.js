'use strict'

let uuid = require('node-uuid');

module.exports = function uuidGenerator() {
	return {
		generate: function () {
			return uuid.v1()
		}
	}
};
