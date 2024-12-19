export default class FileUtil {
    static async fileToBlob(file: File): Promise<Blob> {
    return await file.arrayBuffer()
    .then((arrayBuffer) => {
      return new Blob([new Uint8Array(arrayBuffer)], { type: file.type })
    })
  }

  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Error reading file"))

      reader.readAsDataURL(file);
    });
  }

  static uploadedFileToURL(file: File): string {
    return URL.createObjectURL(file)
  }

  static downloadFromUrl(fileName: string, url: string) {
    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': "blob" }, 
        mode: 'no-cors',
      })
      .then(async (res: Response) => {
        const blob: Blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = fileName;
        anchor.click();
      })
      .catch((rej: PromiseRejectedResult) => {
        console.log(rej.status + ": " + rej.reason)
      })
  }

  static renamed(file: File, name: string) {
    const extensionPointIndex: number = file.name.indexOf('.');
    if (extensionPointIndex >= 0) {
      const fileExtension: string | undefined = file.name.substring(extensionPointIndex, file.name.length)
      return new File([file], name + fileExtension);
    }
    return new File([file], name);
  }

  static createFileList(file: File | File[]): FileList {
    const dataTransfer = new DataTransfer();
    if (Array.isArray(file)) {
      file.forEach(f => dataTransfer.items.add(f))
    } else {
      dataTransfer.items.add(file);
    } 

    return dataTransfer.files;
  }
}