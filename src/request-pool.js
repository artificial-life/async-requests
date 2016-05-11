'use strict'

let _ = require('lodash');
let Request = require('./request.js');

let getGenerator = function (name) {
	return require(`./${name}Generator.js`);
};

class RequestPool {
	constructor(generator, ...params) {
		let Model = getGenerator(generator);
		this.idGenerator = new Model(...params);
		this.requests = {};
		this.body_property = 'body';
		this.status_property = 'status';
		this.warn_at = 0;
	}
	get pending_requests() {
		return _.size(this.requests);
	}
	warnAt(num) {
		this.warn_at = parseInt(num, 10);
	}
	createRequest(params) {
		let id = this.idGenerator.generate();

		let timeout = params && params.timeout || false;
		let r = new Request(timeout);
		_.assign(r, params);
		this.requests[id] = r;

		if (this.warn_at && (this.pending_requests > this.warn_at)) throw new Error('MY PENDING REQUEST IS OVER ' + this.warn_at);

		return r.promise.catch((reason) => {
			if (reason.toString() == 'TimeoutError: operation timeout') this.removeRequest(id, reason);
			throw reason;
		});

	}
	removeRequest(id, reason) {
		return _.unset(this.requests, id)
	}
	handleRequest(data) {
		let id = data.request_id;
		let stored = this.requests[id];

		if (!stored) return false;

		if (data.hasOwnProperty(this.status_property) && data[this.status_property] == false) {
			stored.reject(data.reason)
		} else {
			stored.resolve(data[this.body_property]);
		}

		this.removeRequest(id);
		this.onHandle && this.onHandle(stored, data);
		return true;
	}
	onHandleRequest(callback) {
		this.onHandle = callback;
	}
}

module.exports = RequestPool;
