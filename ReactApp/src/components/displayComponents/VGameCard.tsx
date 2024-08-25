type VGameCardProps = {
  name?: string,
  img?: string
  isUserFav?: boolean,
}

export default function VGameCard(props: VGameCardProps) {
  let defaultProps = {...props};
  defaultProps.name      = defaultProps.name      || "Example";
  defaultProps.img       = defaultProps.img       || "https://placehold.co/160x200";
  defaultProps.isUserFav = defaultProps.isUserFav || false;

  return (
    <div className="flex flex-col w-full h-70 select-none">
      <div className="overflow-hidden">
        <a href="#"><img className="w-full" src={ defaultProps.img } alt="" /></a>
      </div>
      <div className="bg-red-600">
        <h3 className="font-bold text-white mx-2">Example</h3>      
      </div>
    </div>
  );  
}