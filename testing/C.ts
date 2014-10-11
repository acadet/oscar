/// <reference path="../src/ref.ts" />

class C extends UnitTestClass {
	setUp() : void {
		throw new Error('Unvalid setUp');
	}

	tearDown() : void {
		console.log('tearDown C');
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
