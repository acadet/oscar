var Oscar;
(function (Oscar) {
    var TestClass = (function () {
        function TestClass(core) {
            this._core = core;
            this._methods = new Array();
        }
        TestClass.prototype.getName = function () {
            return this._core.constructor.name;
        };

        TestClass.prototype.getCore = function () {
            return this._core;
        };

        TestClass.prototype.addMethod = function (value) {
            this._methods.push(value);
            return this;
        };

        TestClass.prototype.getMethods = function () {
            return this._methods;
        };
        return TestClass;
    })();
    Oscar.TestClass = TestClass;
})(Oscar || (Oscar = {}));
var Oscar;
(function (Oscar) {
    var TestMethod = (function () {
        function TestMethod(name, core, isAsync) {
            if (typeof isAsync === "undefined") { isAsync = false; }
            this._name = name;
            this._core = core;
            this._isAsync = isAsync;
        }
        TestMethod.prototype.getName = function () {
            return this._name;
        };

        TestMethod.prototype.getCore = function () {
            return this._core;
        };

        TestMethod.prototype.isAsync = function () {
            return this._isAsync;
        };

        TestMethod.prototype.isSuccess = function () {
            return this._success;
        };

        TestMethod.prototype.setSuccess = function (value) {
            this._success = value;
        };

        TestMethod.prototype.getError = function () {
            return this._error;
        };

        TestMethod.prototype.setError = function (value) {
            this._error = value;
        };

        TestMethod.prototype.getTime = function () {
            return this._time;
        };

        TestMethod.prototype.setStart = function () {
            this._time = new Date().getTime();
        };

        TestMethod.prototype.setEnd = function () {
            this._time = (new Date().getTime()) - this._time;
        };
        return TestMethod;
    })();
    Oscar.TestMethod = TestMethod;
})(Oscar || (Oscar = {}));
var UnitTestClass = (function () {
    function UnitTestClass() {
    }
    UnitTestClass.prototype.setListener = function (value) {
        this._listener = value;
    };

    UnitTestClass.prototype.success = function () {
        this._listener.onSuccess();
    };

    UnitTestClass.prototype.fail = function () {
        this._listener.onFail();
    };

    UnitTestClass.prototype.setUp = function () {
    };

    UnitTestClass.prototype.tearDown = function () {
    };
    return UnitTestClass;
})();
var TestSuiteOutput;
(function (TestSuiteOutput) {
    TestSuiteOutput[TestSuiteOutput["CONSOLE"] = 0] = "CONSOLE";
    TestSuiteOutput[TestSuiteOutput["HTML"] = 1] = "HTML";
})(TestSuiteOutput || (TestSuiteOutput = {}));

var TestSuite = (function () {
    function TestSuite() {
        this._collected = new Array();
    }
    TestSuite.prototype._shuffleArray = function (a) {
        for (var i = 0; i < a.length; i++) {
            var j;
            var tmp;

            j = Math.round(Math.random() * (a.length - 1));
            tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
    };

    TestSuite.prototype._moveToNextTest = function () {
        this._currentTestMethodIndex++;
        if (this._currentTestMethodIndex < this._currentTestClass.getMethods().length) {
            this._runSingleTest(this._currentTestClass.getMethods()[this._currentTestMethodIndex]);
        } else {
            this._handleClass();
        }
    };

    TestSuite.prototype._runSingleTest = function (test) {
        var _this = this;
        if (test.isAsync()) {
            this._currentAsyncTest = test;

            try  {
                test.setStart();
                this._currentTestClass.getCore().setUp();
                test.getCore().call(this._currentTestClass.getCore());
            } catch (e) {
                try  {
                    this._currentTestClass.getCore().tearDown();
                } catch (e) {
                }
                test.setEnd();
                test.setSuccess(false);
                test.setError(e);
            } finally {
                if (!test.isSuccess()) {
                    this._totalTests++;
                    this._moveToNextTest();
                } else {
                    this._asyncTimer = setTimeout(function () {
                        _this.onFail(new Error('Maximum runtime exceeded'));
                    }, this._maxRuntime);
                }
            }
        } else {
            try  {
                test.setStart();
                this._currentTestClass.getCore().setUp();
                test.getCore.call(this._currentTestClass.getCore());
                this._currentTestClass.getCore().tearDown();
                test.setEnd();
                test.setSuccess(true);
            } catch (e) {
                try  {
                    this._currentTestClass.getCore().tearDown();
                } catch (e) {
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
    };

    TestSuite.prototype._handleClass = function () {
        var methods;

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
    };

    TestSuite.prototype._onRunOver = function () {
        var failedTests;
        var sortMethod;

        failedTests = this._totalTests - this._successfulTests;

        this._collected.sort(function (a, b) {
            if (a.getName() > b.getName()) {
                return 1;
            } else if (a.getName() < b.getName()) {
                return -1;
            } else {
                return 0;
            }
        });

        sortMethod = function (a, b) {
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

        if (this._output === 0 /* CONSOLE */) {
            if (this._totalRuntime < 1) {
                console.log('Total: ' + this._totalTests + ' run in less than 1ms.');
            } else {
                console.log('Total: ' + this._totalTests + ' run in ' + this._totalRuntime + 'ms.');
            }

            console.log('Passed tests: ' + this._successfulTests);
            console.log('Failed tests: ' + failedTests);
            console.log('--- Sum up ---');

            for (var i = 0; i < this._collected.length; i++) {
                var testClass;

                testClass = this._collected[i];
                console.log(testClass.getName() + ':');

                for (var j = 0; j < testClass.getMethods().length; j++) {
                    var testMethod;

                    testMethod = testClass.getMethods()[j];

                    if (testMethod.isSuccess()) {
                        if (testMethod.getTime() < 1) {
                            console.log('\t' + testMethod.getName() + ' - less than 1ms');
                        } else {
                            console.log('\t' + testMethod.getName() + ' - ' + testMethod.getTime() + 'ms');
                        }
                    } else {
                        console.error('\t' + testMethod.getName() + 'FAILED');
                        console.error(testMethod.getError().toString());
                    }
                }
            }
        } else {
            var outcome;

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
                var testClass;

                testClass = this._collected[i];
                outcome += '<li class="test-class">' + testClass.getName() + '<ul>';

                for (var j = 0; j < testClass.getMethods().length; j++) {
                    var testMethod;

                    testMethod = testClass.getMethods()[j];

                    if (testMethod.isSuccess()) {
                        if (testMethod.getTime() < 1) {
                            outcome += '<li class="test-method success">' + testMethod.getName() + ' less than 1ms</li>';
                        } else {
                            outcome += '<li class="test-method success">' + testMethod.getName() + ' - ' + testMethod.getTime() + 'ms</li>';
                        }
                    } else {
                        outcome += '<li class="test-method fail">' + testMethod.getName() + ' FAILED';
                        outcome += testMethod.getError().toString() + '</li>';
                    }
                }

                outcome += '</ul></li>';
            }

            outcome += '</ul>';

            document.body.innerHTML += outcome;
        }

        if (failedTests > 0) {
            throw new Error('Test suite has failed');
        }
    };

    TestSuite.prototype.add = function (test) {
        var testClass;

        testClass = new Oscar.TestClass(test);

        for (var name in test) {
            var prop;
            var l;

            prop = test[name];
            l = name.length;

            if (typeof (prop) === 'function') {
                if (l > 5) {
                    var suffix;

                    suffix = name.substring(l - 4, l).toLowerCase();

                    if (suffix === 'test') {
                        var testMethod;

                        if (l > 9) {
                            var extendedSuffix;

                            extendedSuffix = name.substring(l - 8, l - 4).toLowerCase();

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
    };

    TestSuite.prototype.run = function (output, maxRuntime) {
        this._output = output;

        if (maxRuntime !== null && maxRuntime !== undefined) {
            this._maxRuntime = maxRuntime;
        } else {
            this._maxRuntime = 30 * 1000;
        }

        if (this._collected.length < 1) {
            return;
        }

        this._totalTests = 0;
        this._successfulTests = 0;
        this._totalRuntime = 0;

        this._shuffleArray(this._collected);
        this._currentTestClassIndex = -1;
        this._handleClass();
    };

    TestSuite.prototype.onSuccess = function () {
        var isTearDownOk;
        var error;

        clearTimeout(this._asyncTimer);

        try  {
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
    };

    TestSuite.prototype.onFail = function (error) {
        try  {
            this._currentTestClass.getCore().tearDown();
        } catch (e) {
        }

        this._currentAsyncTest.setEnd();
        this._currentAsyncTest.setSuccess(false);
        this._currentAsyncTest.setError(error);
        this._totalTests++;

        this._moveToNextTest();
    };
    return TestSuite;
})();
var Assert = (function () {
    function Assert() {
    }
    Assert.isTrue = function (value) {
        if (!value) {
            throw new Error('Expected value to be true');
        }
    };

    Assert.isFalse = function (value) {
        if (value) {
            throw new Error('Expected value to be false');
        }
    };

    Assert.isNull = function (value) {
        if (value !== null && value !== undefined) {
            throw new Error('Expected value to be null');
        }
    };

    Assert.isNotNull = function (value) {
        if (value === null || value === undefined) {
            throw new Error('Expected value to be not null');
        }
    };

    Assert.areEqual = function (a, b) {
        if (a !== b) {
            throw new Error('Expected ' + a + ' instead of ' + b);
        }
    };

    Assert.areNotEqual = function (a, b) {
        if (a === b) {
            throw new Error('Expected ' + a + ' instead of ' + b);
        }
    };
    return Assert;
})();
