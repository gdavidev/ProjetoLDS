interface IVGameCardProps {
  name?: string,
  img?: string
}

export default function VGameCard(props: IVGameCardProps) {
  return (
    <div className="flex flex-col w-full h-70 select-none">
      <div className="overflow-hidden">
        <img className="w-full" src={ props.img } alt="" />
      </div>
      <div className="flex justify-between align-middle bg-red-600 px-2 py-1">
        <h3 className="font-bold text-white">{ props.name }</h3>
      </div>
    </div>
  );  
}