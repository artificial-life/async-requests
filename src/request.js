'use strict'

const DEFAULT_TIMEOUT = 15000;

function Request(id, timeout) {
	let resolve;
	let reject;

	let promise = (new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	})).timeout(timeout || DEFAULT_TIMEOUT, 'operation timeout')

	return {
		promise: promise,
		resolve: resolve,
		reject: reject,
		id: id
	}
}

module.exports = Request;
