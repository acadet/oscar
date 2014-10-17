/// <reference path="../ref.ts" />

module Oscar {
	/**
	 * @class OscarObserver
	 * @brief Internal class. Async test observer
	 */
	export class OscarObserver implements IOscarObserver {
		//region Fields

		/**
		 * True if test has been stopped.
		 * When stopped, all notifications from async test
		 * will be ignored.
		 */
		private _isStopped : boolean;

		/**
		 * Observer (test suite)
		 */
		private _listener : Oscar.IOscarObserverListener;
		
		//endregion Fields
		
		//region Constructors

		constructor(listener : Oscar.IOscarObserverListener) {
			this._listener = listener;
			this._isStopped = false;
		}
		
		//endregion Constructors
		
		//region Methods
		
		//region Private Methods
		
		//endregion Private Methods
		
		//region Public Methods

		success() : void {
			if (!this._isStopped) {
				// Simulates an async behavior
				setTimeout(
					() => {
						if (!this._isStopped) {
							this._isStopped = true;
							this._listener.onSuccess();
						}
					},
					0
				);
			}
		}

		fail(error? : Error) : void {
			if (!this._isStopped) {
				// Simulates an async behavior
				setTimeout(
					() => {
						if (!this._isStopped) {
							this._isStopped = true;
							this._listener.onFail(error);
						}
					},
					0
				);
			}
		}

		/**
		 * Stops manually observer
		 */
		stop() : void {
			this._isStopped = true;
		}
		
		//endregion Public Methods
		
		//endregion Methods
	}
}
