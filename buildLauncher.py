import os
import re
import sys

class Engine:
	def __collect(self, path):
		collected = []
		for root, dirs, files in os.walk(path):
			for d in dirs:
				collected + self.__collect(root + d)
			for fileName in files:
				with open(root + fileName, 'r') as f:
					for line in f:
						outcome = re.findall(self.__pattern, line)
						for e in outcome:
							collected.append(e)
		return collected

	def run(self, output, path, testOutput, maxRuntime, buildFailure):
		print('Processing...')

		self.__pattern = 'class (.*) extends UnitTestClass'

		if path[len(path) - 1] != '/':
			path += '/'
		collected = self.__collect(path)

		outcome = '\nnew TestSuite()'
		print ('Collected classes:')
		for e in collected:
			print('\t' + e)
			outcome += '.add(new ' + e + '())'
		outcome += '.run(' + str(testOutput) + ', ' + str(maxRuntime) + ', ' + buildFailure + ');\n'


		with open(output, 'a') as outputFile:
			outputFile.write(outcome)
		print('Done!')

if __name__ == '__main__':
	if len(sys.argv) < 2:
		raise Error('Missing output')
	else:
		path = '.'
		testOutput = 0
		maxRuntime = 30 * 1000
		buildFailure = 'true'

		if len(sys.argv) >= 3:
			path = sys.argv[2]
			if len(sys.argv) >= 4:
				testOutput = sys.argv[3]
				if len(sys.argv) >= 5:
					maxRuntime = sys.argv[4]
					if len(sys.argv) >= 6:
						buildFailure = sys.argv[5]

		Engine().run(sys.argv[1], path, testOutput, maxRuntime, buildFailure)