/// <reference path="ref.ts" />

/**
 * @class IOscarObserver
 * @brief Observer to notify for asynchronous tests
 */
interface IOscarObserver {
	/**
	 * Notifies asynchronous test has been successful
	 */
	success() : void;

	/**
	 * Notifies asynchronous test has failed
	 */
	fail() : void;
}
