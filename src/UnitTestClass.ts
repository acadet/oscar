/// <reference path="ref.ts" />

class UnitTestClass {
	//region Fields

	private _listener : Oscar.IUnitTestClassListener;
	
	//endregion Fields
	
	//region Constructors
	
	//endregion Constructors
	
	//region Methods
	
	//region Private Methods
	
	//endregion Private Methods
	
	//region Public Methods

	setListener(value : Oscar.IUnitTestClassListener) : void {
		this._listener = value;
	}

	success() : void {
		this._listener.onSuccess();
	}

	fail() : void {
		this._listener.onFail();
	}

	setUp() : void {

	}

	tearDown() : void {

	}
	
	//endregion Public Methods
	
	//endregion Methods
}
