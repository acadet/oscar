import re
import sys

###
 # @class TSMinifier
 # @brief Minifies Oscar library
 ###
class TSMinifier:

	###
	 # Runs minifier
	 # @param folder Reference folder
	 # @param refFileName Reference file
	 # @param output Target
	 ###
	def run(self, folder, refFileName, output):
		print('\nProcessing...')

		pattern = '<reference path="(.*)"'
		collected = []

		if folder[len(folder) - 1] != '/':
			folder += '/'

		# First collect all files to browse
		with open(folder + refFileName, 'r') as refFile:
			for line in refFile:
				outcome = re.findall(pattern, line)
				for e in outcome:
					collected.append(e)

		# Then, create minified file
		with open(output, 'w') as outputFile:
			for e in collected:
				with open(folder + e) as file:
					for line in file:
						# Remove comments
						minifiedLine = re.sub('(//(.*)\n)|(/\*\*(.*)\*/)', '', line)
						# Remove whitespaces
						minifiedLine = re.sub('\n', ' ', minifiedLine)
						minifiedLine = re.sub('\t', '', minifiedLine)
						minifiedLine = re.sub('\s{2,}', ' ', minifiedLine)
						# Remove leading whitespaces
						minifiedLine = minifiedLine.lstrip()

						outputFile.write(minifiedLine)

		print('\nDone!')

if __name__ == '__main__':
	folder = 'src'
	refFileName = 'ref.ts'
	output = 'output.min.ts'

	if len(sys.argv) < 2:
		prompt = ' > '
		print('--- TS minifier Wizard ---')

		print('\nSource folder: (default \'src\')')
		data = raw_input(prompt)
		if data != '':
			folder = data

		print('\nReference file name: (default \'ref.ts\')')
		data = raw_input(prompt)
		if data != '':
			refFileName = data

		print('\nOutput: (default \'output.min.ts\')')
		data = raw_input(prompt)
		if data != '':
			output = data
	else:
		if len(sys.argv) >= 2:
			folder = sys.argv[1]
			if len(sys.argv) >= 3:
				refFileName = sys.argv[2]
				if len(sys.argv) >= 4:
					output = sys.argv[3]

	TSMinifier().run(folder, refFileName, output)