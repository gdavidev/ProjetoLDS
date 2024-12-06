import FileUtil from '@libs/FileUtil.ts';

describe('FileUtil', () => {
	it('should rename the file', () => {
		const file: File = new File([], 'FileName')
		const renamedFile = FileUtil.renamed(file, 'NewFileName')

		expect(renamedFile.name).toBe('newFileName')
	});
})