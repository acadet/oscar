/// <reference path="../src/ref.ts" />

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

	alwaysFallingAsyncTest() : void {
		var mock : AsyncMock;

		mock = new AsyncMock();
		mock
			.setSuccess(() => {
				this.success();
			})
			.setError(() => {
				this.fail();
			});

		mock.run();
	}
}
