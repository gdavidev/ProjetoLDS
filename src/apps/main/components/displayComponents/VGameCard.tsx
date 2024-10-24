type VGameCardProps = {
  name?: string,
  emulador?: string,
  img?: string
}

export default function VGameCard(props: VGameCardProps) {
  return (
    <div className="flex flex-col min-w-48 min-h-72 select-none rounded-lg overflow-hidden">
      <div className="overflow-x-hidden grow flex items-center bg-black">
        <img className="h-72" src={ props.img } alt="" />
      </div>
      <div className="flex flex-col flex-none justify-between align-middle bg-primary px-2 py-1">
        <h3 className="font-bold text-white">{ props.name }</h3>
        <span className="text-white text-sm">{ props.emulador }</span>
      </div>
    </div>
  );  
}