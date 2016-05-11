'use strict'

module.exports = function cycleGenerator(max) {
	return {
		current: 0,
		generate: function () {
			return (this.current++) % max
		}
	}
};
