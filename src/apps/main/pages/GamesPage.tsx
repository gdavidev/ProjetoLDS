import { FormEvent, useCallback, useState } from 'react';
import Game from "@models/Game";
import { AxiosError } from 'axios';
import GameCard from "@apps/main/components/displayComponents/GameCard.tsx";
import useGames, { useSearchGames } from '@/hooks/useGames';
import Loading from '@shared/components/Loading.tsx';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import TextInput from '@shared/components/formComponents/TextInput.tsx';
import { IonIcon } from '@ionic/react';
import { close } from "ionicons/icons";
import SearchGamesSideBar from '@apps/main/components/SearchGamesSideBar.tsx';
import useNotification from '@/hooks/feedback/useNotification.tsx';

export default function GamesPage() {
  const [ isSearching, setIsSearching ] = useState<boolean>(false);
  const [ cardList, setCardList ] = useState<JSX.Element[] | undefined>()
  const { notifyError } = useNotification();

  useGames({
    onSuccess: (games: Game[]) => setCardList( gamesToCardList(games) ),
    onError: (err: AxiosError | Error) => console.log(err.message),
    enabled: !isSearching
  });

  const { mutate: searchGames } = useSearchGames({
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

  const updateSearchTerm = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    const newSearchTerm: string = values['nome'] as string;
    setIsSearching(true);
    setCardList(undefined);
    searchGames(newSearchTerm);
  }, [])
  
  return (
    <div className="flex me-4 gap-x-3 min-h-[92vh] -mt-14 -mb-16">
      <SearchGamesSideBar onCategoryClick={ (categoryName: string) => {
        setIsSearching(true);
        searchGames(categoryName)
      }} />
      <div className='mt-14 mb-16 w-full'>
        <form
            onSubmit={ updateSearchTerm }
            className='flex justify-end mb-2 gap-2'>
          <TextInput
              labelClassName='hidden'
              inputContainerClassName='bg-white overflow-hidden border-[1px] border-gray-200 rounded-md'
              inputClassName='w-80 border-none focus:outline-none'
              name='Nome'
              endDecoration={
                <button
                    type='reset'
                    onClick={ () => setIsSearching(false) }>
                  <IonIcon icon={ close } />
                </button>
              } />
          <button type='submit' className='btn-primary'>
            Pesquisar
          </button>
        </form>
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