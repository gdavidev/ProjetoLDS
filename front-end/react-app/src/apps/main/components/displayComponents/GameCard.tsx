import Game from '@/models/Game';
import { Link } from 'react-router-dom';

type GameCardProps = {
	game: Game,
}

export default function GameCard(props: GameCardProps) {
	return (
		<Link to={'/game/' + props.game.id}>
			<div className="flex flex-col min-w-48 min-h-72 select-none rounded-lg overflow-hidden">
				<div className="overflow-x-hidden grow flex items-center bg-black">
					<img className="h-72" src={props.game.thumbnail?.toDisplayable()} alt="" />
				</div>
				<div className="flex flex-col flex-none justify-between align-middle bg-primary px-2 py-1">
					<h3 className="font-bold text-white">{props.game.name}</h3>
					<span className="text-white text-sm">{props.game.emulator.companyName}</span>
				</div>
			</div>
		</Link>
	);
}