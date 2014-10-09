/// <reference path="../ref.ts" />

module Oscar {
	export interface IUnitTestClassListener {
		onSuccess() : void;

		onFail(error? : Error) : void;
	}
}
