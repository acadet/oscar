/// <reference path="../ref.ts" />

module Oscar {
	/**
	 * @class TestMethod
	 * @brief Structure for TestSuite to handle test methods
	 */
	export class TestMethod {
		//region Fields

		/**
		 * Test method name
		 */
		private _name : string;

		/**
		 * Nested test
		 */
		private _core : () => void;

		/**
		 * True if test is asynchronous
		 * @type {boolean}
		 */
		private _isAsync : boolean;

		/**
		 * Bound observer
		 */
		private _observer : Oscar.OscarObserver;

		/**
		 * True if test was successful
		 */
		private _success : boolean;

		/**
		 * Stored error is test has failed
		 */
		private _error : Error;

		/**
		 * Runtime
		 */
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

		/**
		 * Returns name
		 * @return {string} [description]
		 */
		getName() : string {
			return this._name;
		}

		/**
		 * Returns nested test
		 * @param {(} ) [description]
		 */
		getCore() : () => void {
			return this._core;
		}

		/**
		 * Tells if test is asynchronous
		 * @return {boolean} [description]
		 */
		isAsync() : boolean {
			return this._isAsync;
		}

		/**
		 * Gets bounded observer
		 * @return {Oscar.OscarObserver} [description]
		 */
		getObserver() : Oscar.OscarObserver {
			return this._observer;
		}

		/**
		 * Sets bound observer
		 * @param {Oscar.OscarObserver} observer [description]
		 */
		setObserver(observer : Oscar.OscarObserver) : void {
			this._observer = observer;
		}

		/**
		 * Tells if a test was successful
		 * @return {boolean} [description]
		 */
		isSuccess() : boolean {
			return this._success;
		}

		/**
		 * Sets test as successful or no
		 * @param {boolean} value [description]
		 */
		setSuccess(value : boolean) : void {
			this._success = value;
		}

		/**
		 * Gets fail error
		 * @return {Error} [description]
		 */
		getError() : Error {
			if (this._error !== null && this._error !== undefined) {
				return this._error;
			}
			return new Error('Unknown error');
		}

		/**
		 * Sets fail error
		 * @param {Error} value [description]
		 */
		setError(value : Error) : void {
			this._error = value;
		}

		/**
		 * Gets runtime
		 * @return {number} [description]
		 */
		getTime() : number {
			return this._time;
		}

		/**
		 * Sets start time
		 */
		setStart() : void {
			this._time = new Date().getTime();
		}

		/**
		 * Sets end time
		 */
		setEnd() : void {
			this._time = (new Date().getTime()) - this._time;
		}
		
		//endregion Public Methods
		
		//endregion Methods
	}
}
