'use strict'

var RequestPool = require('./request-pool.js');
var UUIDGenerator = require('./uuidGenerator.js');
var CycleGenerator = require('./cycleGenerator.js');

describe('RequestPool', () => {
	let RP;
	beforeEach(() => {
		RP = new RequestPool('cycle', 1000);
	});

	describe('generator UUID', () => {
		it('keys is strings', () => {
			let RU = new RequestPool('uuid');
			expect(RU.idGenerator).to.have.keys('generate');
			RU.createRequest().catch(() => true);
			let first_key = _.keys(RU.requests)[0]
			expect(first_key).to.be.a('string')
		});
	});

	describe('generator Cycle', () => {
		it('arguments passing', () => {
			let RC = new RequestPool('cycle', 1000);
			expect(RC.idGenerator).to.have.any.keys('generate');
			expect(RC.idGenerator).to.have.any.keys('current');
			expect(RC.idGenerator.current).to.equal(0);

			for (var i = 0; i < 999; i++) {
				let r = RC.createRequest();
				r.catch(() => {
					/*suppressed*/
					return true;
				})
			}
			expect(RC.idGenerator.current).to.equal(999);
			RC.createRequest().catch(() => true);
			expect(RC.idGenerator.current).to.equal(0);
		});
	});

	describe('createRequest', () => {
		it('is Promise', () => {
			let request = RP.createRequest();
			request.catch(() => true);

			expect(request).to.be.a('promise')
		})
	});

	describe('request', () => {
		it('resolve', (done) => {
			let request = RP.createRequest();
			let first_key = _.keys(RP.requests)[0];

			RP.handleRequest({
				request_id: first_key,
				body: {
					some: 'data'
				}
			});
			return request.then((data) => {
				expect(data).to.be.a('object')
				done();
			}).catch((e) => done(e));

		});
		it('after resolve requests is empty', (done) => {
			let request = RP.createRequest();
			let first_key = _.keys(RP.requests)[0];

			RP.handleRequest({
				request_id: first_key,
				body: {
					some: 'data'
				}
			});
			return request.then((data) => {
				expect(RP.requests).to.be.empty;
				done();
			}).catch((e) => done(e));

		});
		it('timeout', (done) => {
			let request = RP.createRequest({
				timeout: 500
			});

			return request.catch((reason) => {
				done();
				return true;
			})
		});
	});
});
