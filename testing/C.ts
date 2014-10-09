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
