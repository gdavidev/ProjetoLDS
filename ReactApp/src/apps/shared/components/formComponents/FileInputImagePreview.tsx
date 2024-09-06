import { useEffect, useState, RefObject } from 'react';

type FileInputImagePreviewProps = {
  targetInputRef: RefObject<HTMLInputElement>
  className?: string
}

export default function FileInputImagePreview(props: FileInputImagePreviewProps) {
  const [ selectedFile, setSelectedFile ] = useState<File | undefined>();
  const [ preview     , setPreview ] = useState<string | undefined>();

  useEffect(() => {
    if (props.targetInputRef.current) {
      props.targetInputRef.current.addEventListener('change', 
        (e) => { handleFileSelected(e) }
      )
    }    
  }, [])

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl: string = URL.createObjectURL(selectedFile)
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

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