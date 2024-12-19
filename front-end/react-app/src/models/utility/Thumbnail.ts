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
    this.base64 = source.base64 ? this.getPrefixedBase64Image(source.base64) : null;
    this.url = source.url || null;
    this.fallbackUrl = source.fallbackUrl || null;
  }

  toDisplayable(fallbackUrl?: string): string {
    if (this.base64 !== null)
      return this.getPrefixedBase64Image(this.base64);
    if (this.url !== null)
      return this.url;
    if (this.file) {
      try {
        return FileUtil.uploadedFileToURL(this.file)
      } catch (e) {}
    }
    if (this.fallbackUrl !== null)
      return this.fallbackUrl;
    if (fallbackUrl !== undefined)
      return fallbackUrl;
    return '';
  }

  async getBase64(): Promise<string | null> {
    if (this.base64 !== null)
     return this.base64
    else if (this.file !== null)
      return await FileUtil.fileToBase64(this.file)
    return null;
  }

  private getPrefixedBase64Image(source: string) {
    const sourceAlreadyHasPrefix = source.indexOf('data:image');
    if (sourceAlreadyHasPrefix >= 0)
      return source;

    switch(true) {
      case source.startsWith('/9j/'): return 'data:image/jpeg;base64,' + source;
      case source.startsWith('iVBORw'): return 'data:image/png;base64,' + source;
      case source.startsWith('UklGR'): return 'data:image/webp;base64,' + source;
      case source.startsWith('AAABAA'): return 'data:image/x-icon;base64,' + source;
      case source.startsWith('R0lGOD'): return 'data:image/gif;base64,' + source;
      default: return 'data:image/jpeg;base64,' + source;
    }
  }
}