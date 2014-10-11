/// <reference path="../ref.ts" />

module Oscar {
	/**
	 * @class IOscarObserverListener
	 * @brief Internal class. Observers notify test suite about successful and failing async tests
	 */
	export interface IOscarObserverListener {
		/**
		 * Called when async test has been successful
		 */
		onSuccess() : void;

		/**
		 * Called when async has failed
		 * @param {Error} error Optional error
		 */
		onFail(error? : Error) : void;
	}
}
