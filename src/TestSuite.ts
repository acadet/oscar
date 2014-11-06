/// <reference path="ref.ts" />

/**
 * @class TestSuiteOutput
 * @brief Authorized outputs for test suite
 */
enum TestSuiteOutput {
	CONSOLE,
	HTML
}

/**
 * Process var from node.js
 */
declare var process : any;

/**
 * @class TestSuite
 * @brief Oscar Main class. Handles all tests and sum up results
 */
class TestSuite implements Oscar.IOscarObserverListener {
	//region Fields

	/**
	 * Collected test classes
	 */
	private _collected : Array<Oscar.TestClass>;

	/**
	 * Total run tests
	 */
	private _totalTests : number;

	/**
	 * Total successful tests
	 */
	private _successfulTests : number;

	/**
	 * Total runtime
	 */
	private _totalRuntime : number;

	/**
	 * Selected output for results
	 */
	private _output : TestSuiteOutput;

	/**
	 * Max runtime allowed (for a single test)
	 */
	private _maxRuntime : number;

	/**
	 * If true, test suite will exit with a failure code
	 */
	private _buildFailure : boolean;

	/**
	 * Current tested class
	 */
	private _currentTestClass : Oscar.TestClass;

	/**
	 * Index of current tested class
	 * @type {number}
	 */
	private _currentTestClassIndex : number;

	/**
	 * Index of current test method
	 */
	private _currentTestMethodIndex : number;

	/**
	 * Current async test
	 */
	private _currentAsyncTest : Oscar.TestMethod;

	/**
	 * Async timer
	 */
	private _asyncTimer : any;
	
	//endregion Fields
	
	//region Constructors

	constructor() {
		this._collected = new Array<Oscar.TestClass>();
	}
	
	//endregion Constructors
	
	//region Methods
	
	//region Private Methods

	/**
	 * Run next test
	 */
	private _moveToNextTest() : void {
		this._currentTestMethodIndex++;
		
		if (this._currentTestMethodIndex < this._currentTestClass.getMethods().length) {
			this._runSingleTest(this._currentTestClass.getMethods()[this._currentTestMethodIndex]);
		} else {
			// Tests have been all run for this class, move ahead
			this._handleClass();
		}
	}

	/**
	 * Runs a test, either async or no
	 * @param {Oscar.TestMethod} test [description]
	 */
	private _runSingleTest(test : Oscar.TestMethod) : void {
		if (test.isAsync()) { // Async test
			var hasFailed : boolean;

			this._currentAsyncTest = test;
			test.setObserver(new Oscar.OscarObserver(this));

			try {
				test.setStart();
				this._currentTestClass.getCore().setUp();
				test.getCore().call(this._currentTestClass.getCore(), test.getObserver());
				hasFailed = false;
			} catch (e) {
				try {
					// Run tearDown() to avoid relics
					this._currentTestClass.getCore().tearDown();
				} catch (e) {
					// Do not care about failure from tearDown()
					// For test has already failed
				}

				test.setEnd();
				test.setSuccess(false);
				test.setError(e);
				hasFailed = true;
			} finally {
				if (hasFailed) {
					// Test has failed before calling callback
					test.getObserver().stop();
					this._totalTests++;
					this._totalRuntime += test.getTime();
					this._moveToNextTest();
				} else {
					// Test is running, create runtime timer
					this._asyncTimer = setTimeout(() => {
						test.getObserver().stop();
						this.onFail(new Error('Maximum runtime exceeded'));
					}, this._maxRuntime);
				}
			}
		} else { // Sync test
			try {
				test.setStart();
				this._currentTestClass.getCore().setUp();
				test.getCore().call(this._currentTestClass.getCore());
				this._currentTestClass.getCore().tearDown();
				test.setEnd();
				test.setSuccess(true);
			} catch (e) {
				try {
					// Run tearDown() to avoid relics
					this._currentTestClass.getCore().tearDown();
				} catch (e) {
					// Do not care about failure from tearDown()
					// For test has already failed
				}
				
				test.setEnd();
				test.setSuccess(false);
				test.setError(e);
			} finally {
				if (test.isSuccess()) {
					this._successfulTests++;
				}

				this._totalTests++;
				this._totalRuntime += test.getTime();
				this._moveToNextTest();
			}
		}
	}

	/**
	 * Selects current class to test
	 */
	private _handleClass() : void {
		var methods : Array<Oscar.TestMethod>;

		this._currentTestClassIndex++;

		if (this._currentTestClassIndex >= this._collected.length) {
			// All classes have been tested
			this._onRunOver();
			return;
		}

		this._currentTestClass = this._collected[this._currentTestClassIndex];

		methods = this._currentTestClass.getMethods();
		if (methods.length < 1) {
			// No test to run, go ahead
			this._handleClass();
			return;
		}

		Oscar.Utils.shuffleArray(methods);
		this._currentTestMethodIndex = 0;
		this._runSingleTest(methods[0]);
	}

	/**
	 * Run when all tests are done
	 */
	private _onRunOver() : void {
		var failedTests : number;
		var sortMethod : (a : Oscar.TestMethod, b : Oscar.TestMethod) => number;

		failedTests = this._totalTests - this._successfulTests;

		// Sort tests by class name
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

		// Then by method name
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

		if (this._output === TestSuiteOutput.CONSOLE) { // Console output
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
						console.error('\t\t' + testMethod.getError().toString());
					}
				}
			}
		} else { // HTML outcome
			var outcome : string;

			outcome = '<h1>Unit testing sum up</h1>';
			outcome += '<p class="sum-up">Total tests: <span class="total">' + this._totalTests + '</span>. ';
			outcome += 'Passed tests: <span class="success">' + this._successfulTests + '</span>. ';
			outcome += 'Failed tests: <span class="fail">' + failedTests + '</span>.</p>';

			outcome += '<p>Total: ';
			if (this._totalRuntime < 1) {
				outcome += 'less than 1';
			} else {
				outcome += this._totalRuntime;
			}
			outcome += 'ms</p>';

			outcome += '<ul>';

			for (var i = 0; i < this._collected.length; i++) {
				var testClass : Oscar.TestClass;

				testClass = this._collected[i];
				outcome += '<li class="test-class">' + testClass.getName() + '<ul>';

				for (var j = 0; j < testClass.getMethods().length; j++) {
					var testMethod : Oscar.TestMethod;

					testMethod = testClass.getMethods()[j];

					outcome += '<li class="test-method ';
					if (testMethod.isSuccess()) {
						outcome += ' success">' + testMethod.getName() + ' - ';
						if (testMethod.getTime() < 1) {
							outcome += 'less than 1';
						} else {
							outcome += testMethod.getTime();
						}
						outcome += 'ms';
					} else {
						outcome += 'fail">' + testMethod.getName() + ' FAILED';
						outcome += '<p class="error">' + testMethod.getError().toString() + '</p>';
						console.log(
							'%c' + testMethod.getName() + ' failed with error ' + testMethod.getError().message,
							'color: red'
						);
						console.log('%c' + (<any>testMethod.getError()).stack, 'color : red');
					}
					outcome += '</li>';
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

		if (failedTests > 0 && this._buildFailure) {
			// If Oscar is run with node.js, a build failure could be triggered
			// Could be useful for continous integration
			if (process !== null && process !== undefined) {
				process.exit(1);
			}
		}
	}

	/**
	 * Processes a failing async test
	 * @param {Error} error [description]
	 */
	private _processFailure(error : Error) : void {
		this._currentAsyncTest.setEnd();
		this._currentAsyncTest.setSuccess(false);
		this._currentAsyncTest.setError(error);
		this._totalRuntime += this._currentAsyncTest.getTime();
		this._totalTests++;

		this._moveToNextTest();
	}
	
	//endregion Private Methods
	
	//region Public Methods

	/**
	 * Adds a test class to suite
	 * @param  {UnitTestClass} test [description]
	 * @return {TestSuite}          [description]
	 */
	add(test : UnitTestClass) : TestSuite {
		var testClass : Oscar.TestClass;

		testClass = new Oscar.TestClass(test);

		// Collect all test methods
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

	/**
	 * Runs all tests
	 * @param {TestSuiteOutput} output       [description]
	 * @param {number}          maxRuntime   [description]
	 * @param {boolean}         buildFailure [description]
	 */
	run(output? : TestSuiteOutput, maxRuntime? : number, buildFailure? : boolean) : void {
		if (output !== null && output !== undefined) {
			this._output = output;
		} else {
			this._output = TestSuiteOutput.CONSOLE;
		}
		

		if (maxRuntime !== null && maxRuntime !== undefined) {
			this._maxRuntime = maxRuntime;
		} else {
			this._maxRuntime = 30 * 1000;
		}

		if (buildFailure !== null && buildFailure !== undefined) {
			this._buildFailure = buildFailure;
		} else {
			this._buildFailure = true;
		}

		if (this._collected.length < 1) {
			throw new Error('No test collected');
		}

		this._totalTests = 0;
		this._successfulTests = 0;
		this._totalRuntime = 0;

		Oscar.Utils.shuffleArray(this._collected);
		this._currentTestClassIndex = -1;
		this._handleClass();
	}

	//region Oscar.IUnitTestClassListener

	onSuccess() : void {
		var isTearDownOk : boolean;
		var error : Error;

		// First, stop background timer
		clearTimeout(this._asyncTimer);
		this._asyncTimer = null;

		// Try tearDown()
		try {
			this._currentTestClass.getCore().tearDown();
			isTearDownOk = true;
		} catch (e) {
			error = e;
			isTearDownOk = false;
		}
		
		if (!isTearDownOk) {
			// tearDown() failed. Test must be considered as failed
			this._processFailure(error);
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
		// First, stop background timer
		clearTimeout(this._asyncTimer);
		this._asyncTimer = null;

		try {
			this._currentTestClass.getCore().tearDown();
		} catch (e) {
			// Do not care about failure from tearDown()
			// For test has already failed
		}

		this._processFailure(error);
	}

	//endregion Oscar.IUnitTestClassListener
	
	//endregion Public Methods
	
	//endregion Methods
}
