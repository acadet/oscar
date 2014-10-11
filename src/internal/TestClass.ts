/// <reference path="../ref.ts" />

module Oscar {
	/**
	 * @class TestClass
	 * @brief Structures for test suite to handle tested classes
	 */
	export class TestClass {
		//region Fields

		/**
		 * Tested class
		 */
		private _core : UnitTestClass;

		/**
		 * Test methods to run
		 */
		private _methods : Array<TestMethod>;
		
		//endregion Fields
		
		//region Constructors

		constructor(core : UnitTestClass) {
			this._core = core;
			this._methods = new Array<TestMethod>();
		}
		
		//endregion Constructors
		
		//region Methods
		
		//region Private Methods
		
		//endregion Private Methods
		
		//region Public Methods

		/**
		 * Returns name of nested class
		 * @return {string} [description]
		 */
		getName() : string {
			return <string> (<any> this._core).constructor.name;
		}

		/**
		 * Gets nested class
		 * @return {UnitTestClass} [description]
		 */
		getCore() : UnitTestClass {
			return this._core;
		}

		/**
		 * Adds a test method
		 * @param  {TestMethod} value [description]
		 * @return {TestClass}        [description]
		 */
		addMethod(value : TestMethod) : TestClass {
			this._methods.push(value);
			return this;
		}

		/**
		 * Returns stored methods
		 * @return {Array<TestMethod>} [description]
		 */
		getMethods() : Array<TestMethod> {
			return this._methods;
		}
		
		//endregion Public Methods
		
		//endregion Methods
	}
}
