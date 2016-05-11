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
		this.pending_requests = 0;
		this.body_property = 'body';
	}
	createRequest(params) {
		let id = this.idGenerator.generate();
		let r = new Request();
		_.assign(r, params);
		this.requests[id] = r;
		r.promise.catch((reason) => this.removeRequest(id, reason));

		return r;
	}
	removeRequest(id, reason) {
		return _.unset(this.request, id)
	}
	handleRequest(data) {
		let stored = this.requests[data.request_id];

		if (!stored) return false;

		if (data.hasOwnProperty('status') && data.status == false) stored.reject(data.reason)
		else stored.resolve(data[this.body_property]);
		this.removeRequest(request_id);
		this.onHandle && this.onHandle(data);
		return true;
	}
	onHandleRequest(callback) {
		this.onHandle = callback;
	}
}

module.exports = RequestPool;
