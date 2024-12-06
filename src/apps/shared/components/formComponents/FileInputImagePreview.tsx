import Thumbnail from '@models/utility/Thumbnail';

type FileInputImagePreviewProps = {
  thumbnail?: Thumbnail,
  className?: string,
  imgClassName?: string,
  rounded?: boolean,
}

export default function FileInputImagePreview(props: FileInputImagePreviewProps) {
  const resolvedClassName =
      'overflow-hidden ' + (props.className ?? '')
      + (props.rounded ? ' rounded-full' : ' rounded-md')

  return (
    <div className={ resolvedClassName }>
      <img src={ props.thumbnail && props.thumbnail.toDisplayable() }
          className={ 'object-cover w-full mx-auto ' + props.imgClassName }
          alt="thumbnail-preview" />
    </div>
  );
};
