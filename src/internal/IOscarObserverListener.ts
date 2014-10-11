/// <reference path="../ref.ts" />

module Oscar {
	export interface IOscarObserverListener {
		onSuccess() : void;

		onFail(error? : Error) : void;
	}
}
