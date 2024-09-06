import FavoriteButton from "./FavoriteButton";

interface IVGameCardProps {
  id?: number,
  name?: string,
  img?: string
  isUserFav?: boolean,
}

export default function VGameCard(props: IVGameCardProps) {
  const defaultProps: Partial<IVGameCardProps> = {
    id: 1,
    name: "Example",
    img: "https://placehold.co/90x120",
    isUserFav: false,
  }

  return (
    <div className="flex flex-col w-full h-70 select-none">
      <div className="overflow-hidden">
        <img className="w-full" src={ defaultProps.img } alt="" />
      </div>
      <div className="flex justify-between align-middle bg-red-600 px-2 py-1">
        <h3 className="font-bold text-white">{ defaultProps.name }</h3>
        <FavoriteButton checked={ defaultProps.isUserFav! } />
      </div>
    </div>
  );  
}