/// <reference path="../ref.ts" />

module Oscar {
	export class TestMethod {
		//region Fields

		private _name : string;
		private _core : () => void;
		private _isAsync : boolean;
		private _observer : Oscar.OscarObserver;
		private _success : boolean;
		private _error : Error;
		private _time : number;
		
		//endregion Fields
		
		//region Constructors

		constructor(name : string, core : () => void, isAsync : boolean = false) {
			this._name = name;
			this._core = core;
			this._isAsync = isAsync;
		}
		
		//endregion Constructors
		
		//region Methods
		
		//region Private Methods
		
		//endregion Private Methods
		
		//region Public Methods

		getName() : string {
			return this._name;
		}

		getCore() : () => void {
			return this._core;
		}

		isAsync() : boolean {
			return this._isAsync;
		}

		getObserver() : Oscar.OscarObserver {
			return this._observer;
		}

		setObserver(observer : Oscar.OscarObserver) : void {
			this._observer = observer;
		}

		isSuccess() : boolean {
			return this._success;
		}

		setSuccess(value : boolean) : void {
			this._success = value;
		}

		getError() : Error {
			if (this._error !== null && this._error !== undefined) {
				return this._error;
			}
			return new Error('Unknown error');
		}

		setError(value : Error) : void {
			this._error = value;
		}

		getTime() : number {
			return this._time;
		}

		setStart() : void {
			this._time = new Date().getTime();
		}

		setEnd() : void {
			this._time = (new Date().getTime()) - this._time;
		}
		
		//endregion Public Methods
		
		//endregion Methods
	}
}
