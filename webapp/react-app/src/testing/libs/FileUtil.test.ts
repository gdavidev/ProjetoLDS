import FileUtil from '@libs/FileUtil.ts';

describe('FileUtil', () => {
	it('should rename the file without extension', () => {
		const file: File = new File([], 'FileName')
		const renamedFile = FileUtil.renamed(file, 'NewFileName')

		expect(renamedFile.name).toBe('NewFileName')
	});

	it('should rename the file and keep the extension', () => {
		const file: File = new File([], 'FileName.exe')
		const renamedFile = FileUtil.renamed(file, 'NewFileName')

		expect(renamedFile.name).toBe('NewFileName.exe')
	});
})