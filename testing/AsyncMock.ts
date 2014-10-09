/// <reference path="../src/ref.ts" />

class AsyncMock {
	//region Fields

	private _mustFail : boolean;
	private _success : () => void;
	private _error : () => void;
	
	//endregion Fields
	
	//region Constructors

	constructor() {
		this._mustFail = false;
	}
	
	//endregion Constructors
	
	//region Methods
	
	//region Private Methods
	
	//endregion Private Methods
	
	//region Public Methods

	setSuccess(func : () => void) : AsyncMock {
		this._success = func;
		return this;
	}

	setError(func : () => void) : AsyncMock {
		this._error = func;
		return this;
	}

	mustFail() : AsyncMock {
		this._mustFail = true;
		return this;
	}

	run() : void {
		if (this._mustFail) {
			this._error();
		} else {
			this._success();
		}
	}
	
	//endregion Public Methods
	
	//endregion Methods
}
