import FileUtil from '@libs/FileUtil.ts';

export default class FileHolder {
	file: File | null;
	name: string | null;

	constructor(source?: { file?: File, name?: string }) {
		if (!source) {
			this.file = null;
			this.name = null;
		} else {
			if (source.file) {
				this.file = source.file;
				this.name = source.file.name;
			} else {
				this.file = null;
				this.name = source.name ?? null;
			}
		}
	}

	rename(name: string) {
		if (this.file)
			this.file = FileUtil.renamed(this.file, name);
		this.name = name;
	}
}