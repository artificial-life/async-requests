'use strict'

var CycleGenerator = require('./cycleGenerator.js');

describe('CycleGenerator', () => {
	let CG;
	beforeEach(() => {
		CG = new CycleGenerator(100);
	});

	it('current', () => {
		expect(CG.current).to.equal(0);
		let id = CG.generate();
		expect(id).to.equal(1);
		expect(CG.current).to.equal(1);
		id = CG.generate();
		expect(id).to.equal(2);
		expect(CG.current).to.equal(2);
	});

	it('current reset', () => {
		expect(CG.current).to.equal(0);
		for (let i = 0; i < 100; i++) {
			let id = CG.generate();
		}
		expect(CG.current).to.equal(0);
	});
	it('current reset x2', () => {
		expect(CG.current).to.equal(0);
		for (let i = 0; i < 100 * 2; i++) {
			let id = CG.generate();
		}
		expect(CG.current).to.equal(0);
	});
});
