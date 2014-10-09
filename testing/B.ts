/// <reference path="../src/ref.ts" />

class B extends UnitTestClass {
	setUp() : void {
		console.log('setUp B');
	}

	tearDown() : void {
		console.log('tearDown B');
	}

	failTest() : void {
		Assert.areEqual(3, 2);
		Assert.areEqual(3, 3);
	}

	overflowingAsyncTest() : void {
		var mock : AsyncMock;

		mock = new AsyncMock();
		mock
			.setSuccess(() => {
			})
			.setError(() => {
				this.fail();
			});

		mock.run();
	}
}
