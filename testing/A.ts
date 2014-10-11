/// <reference path="../src/ref.ts" />
/// <reference path="AsyncMock.ts" />

class A extends UnitTestClass {
	setUp() : void {
		console.log('setUp A');
	}

	tearDown() : void {
		console.log('tearDown A');
	}

	hiddenFunc() : void {
		throw new Error('hiddenFunc A');
	}

	aTest() : void {
		var a : Array<number>;

		a = new Array<number>();

		a.push(1);
		a.push(2);

		Assert.areEqual(2, a.length);
		Assert.areEqual(1, a[0]);
		Assert.areEqual(2, a[1]);
	}

	anAsyncTest(obs : IOscarObserver) : void {
		var mock : AsyncMock;

		mock = new AsyncMock();

		mock
			.setSuccess(() => {
				setTimeout(() => obs.success(), 2000);
			})
			.setError(() => {
				obs.fail();
			});

		mock.run();
	}
}
