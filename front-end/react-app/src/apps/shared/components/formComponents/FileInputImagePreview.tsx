import Thumbnail from '@models/utility/Thumbnail';

type FileInputImagePreviewProps = {
  thumbnail?: Thumbnail,
  className?: string,
}

export default function FileInputImagePreview(props: FileInputImagePreviewProps) {
  return (
    <div className={ "rounded-md overflow-hidden " + props.className } >
      <img src={ props.thumbnail ? props.thumbnail.toDisplayable() : "https://placehold.co/300" }          
          className='w-full h-full'
          alt="thumbnail-preview" />
    </div>
  );
};
