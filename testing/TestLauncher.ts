/// <reference path="../src/ref.ts" />
/// <reference path="A.ts" />

class TestLauncher {
	static run() : void {
		var suite : TestSuite;

		suite = new TestSuite();
		suite.add(new A());
		//suite.run(TestSuiteOutput.CONSOLE);
		suite.run(TestSuiteOutput.HTML);
	}
}

TestLauncher.run();
