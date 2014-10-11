/// <reference path="../../src/ref.ts" />

class D extends UnitTestClass {
	setUp() : void {
		console.log('setUp D');
	}

	tearDown() : void {
		throw new Error('Unvalid tearDown');
	}

	alwaysFallingTest() : void {
		Assert.isTrue(true);
	}

	alwaysFallingAsyncTest(obs : IOscarObserver) : void {
		var mock : AsyncMock;

		mock = new AsyncMock();
		mock
			.setSuccess(() => {
				obs.success();
			})
			.setError(() => {
				obs.fail();
			});

		mock.run();
	}
}
