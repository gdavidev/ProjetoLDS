import { useEffect, useState, RefObject } from 'react';
import FileUtil from '@libs/FileUtil';

type FileInputImagePreviewProps = {
  previewImageSource?: File | string,
  targetInputRef: RefObject<HTMLInputElement>,
  className?: string,
}

export default function FileInputImagePreview(props: FileInputImagePreviewProps) {
    const [ selectedFile, setSelectedFile ] = useState<File | undefined>(undefined);
    const [ preview     , setPreview      ] = useState<string | undefined>(undefined);

    useEffect(() => {
      if (props.targetInputRef.current)
        props.targetInputRef.current.addEventListener('change', handleFileSelected)
    }, []);

    useEffect(() => {
      handlePreviewFileChanged(props.previewImageSource)
    }, [props.previewImageSource]);

    useEffect(() => {
      if (selectedFile) {
        const objectUrl: string = FileUtil.uploadedFileToURL(selectedFile)
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl)
      }
      handlePreviewFileChanged(props.previewImageSource);
    }, [selectedFile]);

    async function handlePreviewFileChanged(source?: string | File) {
      if (source === undefined || source === '') {
        setPreview("https://placehold.co/300");
        return;
      } 
      
      if (source instanceof File) {
        setPreview('data:image/jpeg;base64,' + await FileUtil.fileToBase64(source));      
      } else if (typeof source === 'string') {
        setPreview('data:image/jpeg;base64,' + source);
      }
    };

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
      <img src={ preview } className={ "rounded-md " + props.className } 
          alt="thumbnail-preview" />
    );
};
