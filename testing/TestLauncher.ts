/// <reference path="../src/ref.ts" />
/// <reference path="A.ts" />

class TestLauncher {
	static run() : void {
		var suite : TestSuite;

		suite = new TestSuite();
		suite.add(new A());
		suite.add(new B());
		suite.add(new C());
		suite.add(new D());
		//suite.run(TestSuiteOutput.CONSOLE, 5 * 1000);
		suite.run(TestSuiteOutput.HTML, 5 * 1000);
	}
}

TestLauncher.run();
