/// <reference path="ref.ts" />

class Assert {
	//region Fields
	
	//endregion Fields
	
	//region Constructors
	
	//endregion Constructors
	
	//region Methods
	
	//region Private Methods
	
	//endregion Private Methods
	
	//region Public Methods

	static isTrue(value : boolean) : void {
		if (!value) {
			throw new Error('Expected value to be true');
		}
	}

	static isFalse(value : boolean) : void {
		if (value) {
			throw new Error('Expected value to be false');
		}
	}

	static isNull(value : any) : void {
		if (value !== null && value !== undefined) {
			throw new Error('Expected value to be null');
		}
	}

	static isNotNull(value : any) : void {
		if (value === null || value === undefined) {
			throw new Error('Expected value to be not null');
		}
	}

	static areEqual<T>(a : T, b : T) : void {
		if (a !== b) {
			throw new Error('Expected ' + a + ' instead of ' + b);
		}
	}

	static areNotEqual<T>(a : T, b : T) : void {
		if (a === b) {
			throw new Error('Expected ' + a + ' instead of ' + b);
		}
	}
	
	//endregion Public Methods
	
	//endregion Methods
}
