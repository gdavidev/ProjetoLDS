import FileUtil from "@/libs/FileUtil";

export default class Thumbnail {
  public file: File | null;
  public base64: string | null;
  public url: string | null;
  public fallbackUrl: string | null;

  constructor(source: { file?: File, base64?: string, url?: string, fallbackUrl?: string }) {
    if (Object.values(source).every(val => val === undefined))
      throw new Error("No source provided");

    this.file = source.file || null;
    this.base64 = source.base64 || null;
    this.url = source.url || null;
    this.fallbackUrl = source.fallbackUrl || null;
  }

  toDisplayable(): string {
    if (this.base64 !== null)
      return 'data:image/jpeg;base64,' + this.base64;
    if (this.url !== null)
      return this.url;
    if (this.file) {
      try {
        return FileUtil.uploadedFileToURL(this.file)
      } catch (e) {}
    }
    if (this.fallbackUrl !== null)
      return this.fallbackUrl;
    return '';
  }
}