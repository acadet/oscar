/// <reference path="../ref.ts" />

class Utils {
	static shuffleArray<T>(a : Array<T>) : void {
		var n : number;
		var f : (min : number, max : number) => number;

		f = (min, max) => {
			return Math.round(Math.random() * max) + min;
		};

		n = f(a.length, a.length * a.length);

		while (n >= 0) {
			var i : number, j : number;
			var tmp : T;

			i = f(0, a.length - 1);
			j = f(0, a.length - 1);
			tmp = a[i];
			a[i] = a[j];
			a[j] = tmp;

			n--;
		}
	}
}
