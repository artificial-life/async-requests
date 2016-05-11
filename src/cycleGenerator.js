'use strict'

module.exports = function cycleGenerator(max) {
	return {
		current: 0,
		generate: function () {
			this.current = (this.current + 1) % max;
			return this.current;
		}
	}
};
