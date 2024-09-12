import { useEffect, useState, RefObject } from 'react';
import FileUtil from '../../../../libs/FileUtil';

type FileInputImagePreviewProps = {
  targetInputRef: RefObject<HTMLInputElement>
  initializeWith?: string | File
  className?: string
}

export default function FileInputImagePreview(props: FileInputImagePreviewProps) {
  const [ selectedFile, setSelectedFile ] = useState<File | undefined>();
  const [ preview     , setPreview      ] = useState<string | undefined>();

  useEffect(() => {
    if (props.targetInputRef.current) {
      props.targetInputRef.current.addEventListener('change', 
        (e) => { handleFileSelected(e) }
      )
    }
    initializeWithStartingProp()    
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

  async function initializeWithStartingProp() {
    if (props.initializeWith === undefined) return
    
    if (typeof props.initializeWith === 'string')
      setPreview('data:image/jpeg;base64,' + props.initializeWith)
    else if (props.initializeWith instanceof File)
      setPreview('data:image/jpeg;base64,' + await FileUtil.fileToBase64(props.initializeWith))
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
}