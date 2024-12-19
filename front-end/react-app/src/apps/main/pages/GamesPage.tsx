import Game from "@models/Game";
import { AxiosError } from 'axios';
import GameCard from "@apps/main/components/displayComponents/GameCard.tsx";
import useGames, { useSearchGames } from '@/hooks/useGames';
import Loading from '@shared/components/Loading.tsx';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import SearchGamesSideBar from '@apps/main/components/SearchGamesSideBar.tsx';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import SearchBar from '@shared/components/formComponents/SearchBar.tsx';
import { useEffect, useState } from 'react';
import useTypeSafeSearchParams from '@/hooks/useTypeSafeSearchParams.ts';

type GamesPageParams = {
  search: string;
}

export default function GamesPage() {
  const { params, setParams, clearParams } = useTypeSafeSearchParams<GamesPageParams>({ search: '' });
  const [ cardList   , setCardList    ] = useState<JSX.Element[] | undefined>();
  const { notifyError } = useNotification();

  const { refetch, isLoading } = useGames({
    onSuccess: (games: Game[]) => setCardList( gamesToCardList(games) ),
    onError: (err: AxiosError | Error) => console.log(err.message),
    enabled: !params.search
  });

  const { mutate: searchGames, isLoading: isSearchGamesLoading } = useSearchGames({
    onSuccess: (games: Game[]) => {
      if (games.length === 0) {
        notifyError('Nenhum jogo encontrado');
        setCardList([]);
      } else {
        setCardList( gamesToCardList(games) )
      }
    },
    onError: (err: AxiosError | Error) => handleRequestError(err),
  });

  const { handleRequestError } = useRequestErrorHandler({
    mappings: [{ status: 'default', userMessage: "Por favor tente novamente mais tarde.", log: true }],
    onError: notifyError
  });

  useEffect(() => {
    if (params.search)
      searchGames(params.search);
  }, []);

  return (
    <div className="flex me-4 gap-x-3 min-h-[92vh] -mt-14 -mb-16">
      <SearchGamesSideBar onCategoryClick={ (categoryName: string) => {
        searchGames(categoryName);
        setParams('search', categoryName);
      }} />

      <div className='mt-14 mb-16 w-full'>
        <SearchBar
            onSearch={ (text: string) => {
              setParams('search', text);
              searchGames(text);
            }}
            onErase={ () => {
              clearParams();
              refetch();
            }}
            isLoading={ isSearchGamesLoading || isLoading }
            defaultValue={ params.search }
        />

        {
          !cardList ? <Loading className='grow' /> :
            <div className="grow grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-2">
              { cardList }
            </div>
        }
      </div>
    </div>
  );
}

function gamesToCardList(games: Game[]) {
  return games.map((game: Game, index: number) => <GameCard key={ index } game={ game } />)
}