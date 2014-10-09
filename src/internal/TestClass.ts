/// <reference path="../ref.ts" />

module Oscar {
	export class TestClass {
		//region Fields

		private _core : UnitTestClass;
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

		getName() : string {
			return <string> (<any> this._core).constructor.name;
		}

		getCore() : UnitTestClass {
			return this._core;
		}

		addMethod(value : TestMethod) : TestClass {
			this._methods.push(value);
			return this;
		}

		getMethods() : Array<TestMethod> {
			return this._methods;
		}
		
		//endregion Public Methods
		
		//endregion Methods
	}
}
