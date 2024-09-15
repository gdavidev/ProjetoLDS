import { useEffect, useState, RefObject, ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import FileUtil from '../../../../libs/FileUtil';

type FileInputImagePreviewProps = {
  targetInputRef: RefObject<HTMLInputElement>
  className?: string
}

const FileInputImagePreview = 
  forwardRef((props: FileInputImagePreviewProps, ref: ForwardedRef<any>) => {
    const [ selectedFile, setSelectedFile ] = useState<File | undefined>();
    const [ preview     , setPreview      ] = useState<string | undefined>();

    useImperativeHandle(ref, () => ({
      setPreviewImage(source: string) {
        initializeWithSetPreviewImage(source)
      }
    }), []);

    useEffect(() => {
      if (props.targetInputRef.current)
        props.targetInputRef.current.addEventListener('change', handleFileSelected)
    }, [])

    useEffect(() => {
      if (!selectedFile) {
        setPreview(undefined);
        return;
      }
      const objectUrl: string = FileUtil.uploadedFileToURL(selectedFile)
      setPreview(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    async function initializeWithSetPreviewImage(source: string | File | undefined) {
      if (source === undefined) return
      
      if (typeof source === 'string')
        setPreview('data:image/jpeg;base64,' + source)
      else if (source instanceof File)
        setPreview('data:image/jpeg;base64,' + await FileUtil.fileToBase64(source))
    }

    function handleFileSelected(e: Event) {
      const targetElement = e.target as HTMLInputElement | null;    
      if (targetElement && targetElement.files) {
        if (targetElement.files.length === 0)
          setSelectedFile(undefined);
        else
          setSelectedFile(targetElement.files[0]);
      }
    }  

    return (
      <img src={ preview } className={"rounded-md " + props.className } alt="thumbnail-preview" />
    );
});
export default FileInputImagePreview