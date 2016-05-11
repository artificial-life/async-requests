'use strict'

const DEFAULT_TIMEOUT = 15;

function Request(timeout) {
	let resolve;
	let reject;

	let promise = (new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	})).timeout(timeout || DEFAULT_TIMEOUT, 'operation timeout')

	return {
		promise: promise,
		resolve: resolve,
		reject: reject
	}
}

module.exports = Request;
