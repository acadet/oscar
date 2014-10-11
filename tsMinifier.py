import re
import sys

class Engine:
	def run(self, refPath, folder, output):
		pattern = '<reference path="(.*)"'
		collected = []

		with open(refPath, 'r') as refFile:
			for line in refFile:
				outcome = re.findall(pattern, line)
				for e in outcome:
					collected.append(e)

		if folder[len(folder) - 1] != '/':
			folder += '/'

		with open(output, 'w') as outputFile:
			for e in collected:
				with open(folder + e) as file:
					for line in file:
						minifiedLine = re.sub('(//(.*)\n)|(/\*\*(.*)\*/)', '', line)
						minifiedLine = re.sub('\n', ' ', minifiedLine)
						minifiedLine = re.sub('\t', '', minifiedLine)
						minifiedLine = re.sub('[ \t\n\r\f\v]{2,}', ' ', minifiedLine)

						outputFile.write(minifiedLine)

if __name__ == '__main__':
	if len(sys.argv) < 1:
		# TODO: wizard
		print('wizard')
	else:
		refPath = 'src/ref.ts'
		folder = 'src'
		output = 'output.min.ts'

		if len(sys.argv) >= 2:
			refPath = sys.argv[1]
			if len(sys.argv) >= 3:
				folder = sys.argv[2]
				if len(sys.argv) >= 4:
					output = sys.argv[3]

		Engine().run(refPath, folder, output)