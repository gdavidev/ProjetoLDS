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
    <div className="flex bg-slate-600 text-white p-3 align-middle gap-x-2">
      <div className="overflow-hidden w-40 h-40">
        <img className="h-full" src={ defaultProps.img } alt={ defaultProps.name } />
      </div>
      <div className="flex flex-col">
        <h3 className="font-black text-3xl">{ defaultProps.name }</h3>
        <p className="h-full">{ defaultProps.desc }</p>
        <a href={ defaultProps.filePath } 
          className="btn-r-md w-fit self-end bg-green-500 hover:bg-green-600">Play
        </a>
      </div>    
    </div>
  );
}