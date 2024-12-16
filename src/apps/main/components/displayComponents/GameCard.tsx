import Game from '@/models/Game';
import { Link } from 'react-router-dom';

type GameCardProps = {
	game: Game,
}

export default function GameCard(props: GameCardProps) {
	return (
		<Link to={'/game/' + props.game.id}>
			<div className="flex flex-col select-none rounded-lg overflow-hidden">
				<div className="overflow-hidden grow flex items-center bg-black">
					<img
							className="object-cover h-80 w-full"
							src={ props.game.thumbnail?.toDisplayable() }
							alt={ props.game.name } />
				</div>
				<div className="flex flex-col flex-none justify-between align-middle bg-primary px-2 py-1">
					<h3 className="font-bold text-white line-clamp-1">{props.game.name}</h3>
					<span className="text-white text-sm line-clamp-1">{props.game.emulator.companyName}</span>
				</div>
			</div>
		</Link>
	);
}