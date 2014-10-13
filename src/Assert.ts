/// <reference path="ref.ts" />

/**
 * @class Assert
 * @brief Provides methods for asserting when testing
 */
class Assert {
	//region Fields
	
	//endregion Fields
	
	//region Constructors
	
	//endregion Constructors
	
	//region Methods
	
	//region Private Methods
	
	//endregion Private Methods
	
	//region Public Methods

	/**
	 * Asserts provided value is true
	 * @param {boolean} value [description]
	 */
	static isTrue(value : boolean) : void {
		if (!value) {
			throw new Error('Expected value to be true');
		}
	}

	/**
	 * Asserts provided value is false
	 * @param {boolean} value [description]
	 */
	static isFalse(value : boolean) : void {
		if (value) {
			throw new Error('Expected value to be false');
		}
	}

	/**
	 * Asserts provided value is null
	 * @param {T} value [description]
	 */
	static isNull<T>(value : T) : void {
		if (value !== null && value !== undefined) {
			throw new Error('Expected value to be null');
		}
	}

	/**
	 * Asserts provided value is not null
	 * @param {T} value [description]
	 */
	static isNotNull<T>(value : T) : void {
		if (value === null || value === undefined) {
			throw new Error('Expected value to be not null');
		}
	}

	/**
	 * Asserts provided values are equal
	 */
	static areEqual<T>(expected : T, value : T) : void {
		if (value !== expected) {
			throw new Error('Expected ' + expected + ' instead of ' + value);
		}
	}

	/**
	 * Asserts provided values are not equal
	 */
	static areNotEqual<T>(unexpected : T, value : T) : void {
		if (value === unexpected) {
			throw new Error('Unexpected ' + unexpected + ' instead of ' + value);
		}
	}
	
	//endregion Public Methods
	
	//endregion Methods
}
