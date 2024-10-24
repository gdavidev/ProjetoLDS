export default class Thumbnail {
  public file: File | null;
  public base64: string | null;

  /**
   * @construtor
   * @param source File or the actual base64 string;
   * @param base64 If you passed a file before, pass the base64 string here.
   */
  constructor(source: File | string, base64?: string) {
    this.file = source instanceof File ? source : null;
    
    if (base64 !== undefined)
      this.base64 = base64;
    else if (typeof source === 'string')
      this.base64 = source;
    else 
      this.base64 = null;
  }

  toDisplayable(): string {
    if (this.base64)
      return 'data:image/jpeg;base64,' + this.base64
    return ""
  }
}