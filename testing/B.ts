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

	overflowingAsyncTest(obs : IOscarObserver) : void {
		var mock : AsyncMock;

		mock = new AsyncMock();
		mock
			.setSuccess(() => {
			})
			.setError(() => {
				obs.fail();
			});

		mock.run();
	}

	exceedTimeoutAsyncTest(obs : IOscarObserver) : void {
		var mock : AsyncMock;

		mock = new AsyncMock();
		mock
			.setSuccess(() => {
				setTimeout(() => obs.success(), 5100);
			})
			.setError(() => {
				obs.fail();
			});

		mock.run();
	}
}
