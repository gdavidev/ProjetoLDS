import { HGameCard } from "../components/displayComponents/HGameCard";

export default function GamesPage() {
  const gameCards: React.ReactElement[] = Array.from({length: 3},
    (_, i) => <HGameCard key={i}/>
  );
  
  return (
    <>
      <div className="flex flex-col gap-y-2">
        { gameCards }
      </div>
    </>
  );
}