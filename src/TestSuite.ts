/// <reference path="ref.ts" />

enum TestSuiteOutput {
	CONSOLE,
	HTML
}

class TestSuite implements Oscar.IUnitTestClassListener {
	//region Fields

	private _collected : Array<Oscar.TestClass>;
	private _totalTests : number;
	private _successfulTests : number;
	private _totalRuntime : number;

	private _output : TestSuiteOutput;
	private _maxRuntime : number;

	private _currentTestClass : Oscar.TestClass;
	private _currentTestClassIndex : number;
	private _currentTestMethodIndex : number;

	private _currentAsyncTest : Oscar.TestMethod;
	private _asyncTimer : any;
	
	//endregion Fields
	
	//region Constructors

	constructor() {
		this._collected = new Array<Oscar.TestClass>();
	}
	
	//endregion Constructors
	
	//region Methods
	
	//region Private Methods

	private _shuffleArray<T>(a : Array<T>) : void {
		for (var i = 0; i < a.length; i++) {
			var j : number;
			var tmp : T;

			j = Math.round(Math.random() * (a.length - 1));
			tmp = a[i];
			a[i] = a[j];
			a[j] = tmp;
		}
	}

	private _moveToNextTest() : void {
		this._currentTestMethodIndex++;
		if (this._currentTestMethodIndex < this._currentTestClass.getMethods().length) {
			this._runSingleTest(this._currentTestClass.getMethods()[this._currentTestMethodIndex]);
		} else {
			this._handleClass();
		}
	}

	private _runSingleTest(test : Oscar.TestMethod) : void {

		if (test.isAsync()) {
			var hasFailed : boolean;
			this._currentAsyncTest = test;

			try {
				test.setStart();
				this._currentTestClass.getCore().setUp();
				test.getCore().call(this._currentTestClass.getCore());
				hasFailed = false;
			} catch (e) {
				try {
					this._currentTestClass.getCore().tearDown();
				} catch (e) {
					// TODO
				}
				test.setEnd();
				test.setSuccess(false);
				test.setError(e);
				hasFailed = true;
			} finally {
				if (hasFailed) {
					this._totalTests++;
					this._moveToNextTest();
				} else {
					this._asyncTimer = setTimeout(() => {
						this.onFail(new Error('Maximum runtime exceeded'));
					}, this._maxRuntime);
				}
			}
		} else {
			try {
				test.setStart();
				this._currentTestClass.getCore().setUp();
				test.getCore.call(this._currentTestClass.getCore());
				this._currentTestClass.getCore().tearDown();
				test.setEnd();
				test.setSuccess(true);
			} catch (e) {
				try {
					this._currentTestClass.getCore().tearDown();
				} catch (e) {
					// TODO
				}
				
				test.setEnd();
				test.setSuccess(false);
				test.setError(e);
			} finally {
				if (test.isSuccess()) {
					this._successfulTests++;
					this._totalRuntime += test.getTime();
				}

				this._totalTests++;				
				this._moveToNextTest();
			}
		}
	}

	private _handleClass() : void {
		var methods : Array<Oscar.TestMethod>;

		this._currentTestClassIndex++;
		if (this._currentTestClassIndex >= this._collected.length) {
			this._onRunOver();
			return;
		}

		this._currentTestClass = this._collected[this._currentTestClassIndex];

		methods = this._currentTestClass.getMethods();
		if (methods.length < 1) {
			this._handleClass();
			return;
		}

		this._shuffleArray(methods);
		this._currentTestMethodIndex = 0;
		this._runSingleTest(methods[0]);
	}

	private _onRunOver() : void {
		var failedTests : number;
		var sortMethod : (a : Oscar.TestMethod, b : Oscar.TestMethod) => number;

		failedTests = this._totalTests - this._successfulTests;

		this._collected.sort(
			(a, b) => {
				if (a.getName() > b.getName()) {
					return 1;
				} else if (a.getName() < b.getName()) {
					return -1;
				} else {
					return 0;
				}
			}
		);

		sortMethod = (a, b) => {
			if (a.getName() > b.getName()) {
				return 1;
			} else if (a.getName() < b.getName()) {
				return -1;
			} else {
				return 0;
			}
		};

		for (var i = 0; i < this._collected.length; i++) {
			this._collected[i].getMethods().sort(sortMethod);
		}

		if (this._output === TestSuiteOutput.CONSOLE) {
			console.log('--- Unit testing sum up ---');

			if (this._totalRuntime < 1) {
				console.log('Total: ' + this._totalTests + ' run in less than 1ms.');
			} else {
				console.log('Total: ' + this._totalTests + ' run in ' + this._totalRuntime + 'ms.');
			}
			
			console.log('Passed tests: ' + this._successfulTests);
			console.log('Failed tests: ' + failedTests + '\n');
			

			for (var i = 0; i < this._collected.length; i++) {
				var testClass : Oscar.TestClass;

				testClass = this._collected[i];
				console.log(testClass.getName() + ':');

				for (var j = 0; j < testClass.getMethods().length; j++) {
					var testMethod : Oscar.TestMethod;

					testMethod = testClass.getMethods()[j];

					if (testMethod.isSuccess()) {
						if (testMethod.getTime() < 1) {
							console.log('\t' + testMethod.getName() + ' - less than 1ms');
						} else {
							console.log('\t' + testMethod.getName() + ' - ' + testMethod.getTime() + 'ms');
						}
					} else {
						console.error('\t' + testMethod.getName() + ' FAILED');
						console.error(testMethod.getError().toString());
					}
				}
			}
		} else {
			var outcome : string;

			outcome = '<h1>Unit testing sum up</h1>';
			outcome += '<p class="sum-up">Total tests: <span class="total">' + this._totalTests + '</span>. ';
			outcome += 'Passed tests: <span class="success">' + this._successfulTests + '</span>. ';
			outcome += 'Failed tests: <span class="fail">' + failedTests + '</span>.</p>';

			if (this._totalRuntime < 1) {
				outcome += '<p>Total: less than 1ms</p>';
			} else {
				outcome += '<p>Total: ' + this._totalRuntime + 'ms</p>';
			}

			outcome += '<ul>';

			for (var i = 0; i < this._collected.length; i++) {
				var testClass : Oscar.TestClass;

				testClass = this._collected[i];
				outcome += '<li class="test-class">' + testClass.getName() + '<ul>';

				for (var j = 0; j < testClass.getMethods().length; j++) {
					var testMethod : Oscar.TestMethod;

					testMethod = testClass.getMethods()[j];

					if (testMethod.isSuccess()) {
						if (testMethod.getTime() < 1) {
							outcome += '<li class="test-method success">' + testMethod.getName() + ' less than 1ms</li>';
						} else {
							outcome += '<li class="test-method success">' + testMethod.getName() + ' - ' + testMethod.getTime() + 'ms</li>';
						}
					} else {
						outcome += '<li class="test-method fail">' + testMethod.getName() + ' FAILED';
						outcome += '<p class="error">' + testMethod.getError().toString() + '</p></li>';
					}
				}

				outcome += '</ul></li>';
			}

			outcome += '</ul>';

			if (document.body !== null && document.body !== undefined) {
				document.body.innerHTML += outcome;
			} else {
				document.documentElement.innerHTML += '<body>' + outcome + '</body>';
			}
		}

		if (failedTests > 0) {
			throw new Error('Test suite has failed');
		}
	}
	
	//endregion Private Methods
	
	//region Public Methods

	add(test : UnitTestClass) : TestSuite {
		var testClass : Oscar.TestClass;

		testClass = new Oscar.TestClass(test);
		test.setListener(this);

		for (var name in test) {
			var prop : any;
			var l : number;

			prop = test[name];
			l = name.length;

			if (typeof(prop) === 'function') {
				if (l > 4) {
					var suffix : string;

					suffix = name.substring(l - 4, l).toLowerCase();

					if (suffix === 'test') {
						var testMethod : Oscar.TestMethod;

						if (l > 9) {
							var extendedSuffix : string;

							extendedSuffix = name.substring(l - 9, l - 4).toLowerCase();

							if (extendedSuffix === 'async') {
								testMethod = new Oscar.TestMethod(name, prop, true);
							} else {
								testMethod = new Oscar.TestMethod(name, prop, false);
							}
						} else {
							testMethod = new Oscar.TestMethod(name, prop, false);
						}

						testClass.addMethod(testMethod);
					}
				}
			}
		}

		this._collected.push(testClass);

		return this;
	}

	run(output : TestSuiteOutput, maxRuntime? : number) : void {
		this._output = output;

		if (maxRuntime !== null && maxRuntime !== undefined) {
			this._maxRuntime = maxRuntime;
		} else {
			this._maxRuntime = 30 * 1000;
		}

		if (this._collected.length < 1) {
			// TODO
			return;
		}

		this._totalTests = 0;
		this._successfulTests = 0;
		this._totalRuntime = 0;

		this._shuffleArray(this._collected);
		this._currentTestClassIndex = -1;
		this._handleClass();
	}

	//region Oscar.IUnitTestClassListener

	onSuccess() : void {
		var isTearDownOk : boolean;
		var error : Error;

		clearTimeout(this._asyncTimer);

		try {
			this._currentTestClass.getCore().tearDown();
			isTearDownOk = true;
		} catch (e) {
			error = e;
			isTearDownOk = false;
		}
		
		if (!isTearDownOk) {
			this.onFail(error);
			return;
		}

		this._currentAsyncTest.setEnd();
		this._currentAsyncTest.setSuccess(true);
		this._successfulTests++;
		this._totalTests++;
		this._totalRuntime += this._currentAsyncTest.getTime();

		this._moveToNextTest();
	}

	onFail(error? : Error) : void {
		try {
			this._currentTestClass.getCore().tearDown();
		} catch (e) {
			// TODO
		}

		this._currentAsyncTest.setEnd();
		this._currentAsyncTest.setSuccess(false);
		this._currentAsyncTest.setError(error);
		this._totalTests++;

		this._moveToNextTest();
	}

	//endregion Oscar.IUnitTestClassListener
	
	//endregion Public Methods
	
	//endregion Methods
}
