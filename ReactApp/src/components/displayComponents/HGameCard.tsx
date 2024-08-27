type HGameCardProps = {
  name?: string,
  desc?: string,
  img?: string,
  filePath?: string
}

export function HGameCard(props: HGameCardProps) {
  let defaultProps = {...props};
  defaultProps.name      = defaultProps.name      || "Example"
  defaultProps.desc      = defaultProps.desc      || "Lorem ipsum dolor, sit amet consectetur adipisicing elit. A delectus ea pariatur sapiente vel, nulla quia totam, recusandae aut cupiditate nihil dolor commodi repellendus explicabo repellat perferendis. Sunt, mollitia rem!"
  defaultProps.img       = defaultProps.img       || "https://placehold.co/90x120"
  defaultProps.filePath  = defaultProps.filePath  || "./file"

  return (
    <div className="flex">
      <div>
        <img src={ defaultProps.img } alt={ defaultProps.name } />
      </div>
      <div className="flex flex-col">
        <h3>{ defaultProps.name }</h3>
        <p>{ defaultProps.desc }</p>
        <a href="">{ defaultProps.filePath }</a>
      </div>    
    </div>
  );
}