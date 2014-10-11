/// <reference path="../ref.ts" />

module Oscar {
	export class OscarObserver implements IOscarObserver {
		//region Fields

		private _isStopped : boolean;
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
				this._isStopped = true;
				this._listener.onSuccess();
			}
		}

		fail() : void {
			if (!this._isStopped) {
				this._isStopped = true;
				this._listener.onFail();
			}
		}

		stop() : void {
			this._isStopped = true;
		}
		
		//endregion Public Methods
		
		//endregion Methods
	}
}
