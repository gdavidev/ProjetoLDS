import React, { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Game from '@models/Game';
import { IonIcon } from '@ionic/react';
import { add, createOutline, reloadOutline, trashOutline } from 'ionicons/icons';
import TableDisplay from '@apps/admin/components/TableDisplay';
import GameEditModal from '@apps/admin/components/modal/GameEditModal';
import { IconButton } from '@mui/material';
import useCurrentUser from '@/hooks/useCurrentUser';
import useStatefulArray from '@/hooks/useStatefulArray';
import useGames, { useDeleteGame } from '@/hooks/useGames';
import useMessageBox from '@/hooks/interaction/useMessageBox.ts';
import { MessageBoxResult, MessageBoxType } from '@shared/components/MessageBox.tsx';

export default function GamesView() {
  const [ gameModalData   , setGameModalData   ] = useState<Game | undefined>();
  const [ isGameModalOpen , setIsGameModalOpen ] = useState<boolean>(false);
  const { openMessageBox } = useMessageBox();
  const { user } = useCurrentUser();
  const gameList = useStatefulArray<Game>([], {
    compare: (game1: Game, game2: Game) => game1.id === game2.id
  });

  const { refetch: refetchGames } = useGames({
    onSuccess: (games: Game[]) => gameList.set(games.sort((prev, curr) => prev.id - curr.id))
  });
  const { mutate: deleteGame } = useDeleteGame(user?.token!, {
    onSuccess: (game: Game) => gameList.remove(game),
    onError: (err: any) => console.log("err: " + JSON.stringify(err))
  })

  function addGame() {
    setGameModalData(undefined);
    setIsGameModalOpen(true);
  }
  function editGame(game: Game) {
    setGameModalData(game);
    setIsGameModalOpen(true);
  }
  
  const updateGameOnGameList = (newGame: Game) => {
    const oldGame: Game | undefined = gameList.find(game => game.id === newGame.id)
    if (oldGame) {
      const updatedGame: Game = newGame
      if (updatedGame.thumbnail === undefined && oldGame.thumbnail !== undefined)
        updatedGame.thumbnail = oldGame.thumbnail
      if (updatedGame.rom === undefined && oldGame.rom !== undefined)
        updatedGame.rom = oldGame.rom

      gameList.update(newGame)
    }
  }

  const onDeleteGame = useCallback((game: Game) => {
    openMessageBox({
      title: 'Apagar Jogo',
      message: 'Tem certeza que deseja apagar esse jogo?',
      type: MessageBoxType.YES_NO,
      onClick: (result: MessageBoxResult) => {
        if (result === MessageBoxResult.YES)
          deleteGame(game);
      }
    })
  }, []);

  const templateHeader: {colName: string, colWidth: string}[] = [
    {colName: ''            , colWidth: 'fit-content' },
    {colName: '#'           , colWidth: '30px'        },
    {colName: 'Name'        , colWidth: '230px'       },
    {colName: 'Description' , colWidth: '400px'       },
    {colName: 'Emulador'    , colWidth: '160px'       }, 
    {colName: 'Categoria'   , colWidth: '90px'        },
    {colName: ''            , colWidth: '120px'       }
  ]

  return (
    <>
      <section className="flex flex-col">
        <div className="flex justify-between items-center mx-5 text-white">
          <h2 className="font-rubik font-bold">
            Lista de Jogos
          </h2>
          <div className="flex gap-x-2 ">
            <IconButton 
              size='small'              
              onClick={ () => refetchGames() }
            >
              <IonIcon style={{color: 'white'}} icon={ reloadOutline } />
            </IconButton>
            <button
                className='btn-primary'
                onClick={ addGame }>
              <IonIcon icon={ add } /> Novo Jogo
            </button>
          </div>
        </div>
        <TableDisplay headerTemplate={ templateHeader } 
            tableStyleObject={{width: '100%', borderSpacing: '0 3px'}}
            tableHeaderClassName='text-white font-rubik font-bold'>
          { 
            gameList.all.map((game: Game, index: number) => {
                return ( 
                  <GameDataTableRow 
                    key={index} 
                    game={ game }
                    rowClassName="bg-primary-light text-white"
                    cellClassName='first:rounded-s-md last:rounded-e-md'
                    actions={{
                      edit: editGame, 
                      delete: onDeleteGame
                    }} 
                  />
                )
              })            
          }
        </TableDisplay>
      </section>
      <GameEditModal
          game={ gameModalData }
          onCloseRequest={ () => { setIsGameModalOpen(false) } }
          isOpen={ isGameModalOpen }
          onChange={ (game: Game) => {
            if (gameModalData && gameModalData.id === 0)
               return gameList.append(game)
            updateGameOnGameList(game)
          } } />
    </>
  );
}

type GameDataTableRowProps = {
  rowClassName?: string,
  cellClassName?: string,
  game: Game,
  actions: {
    edit: (game: Game) => void,
    delete: (game: Game) => void,
  }
}

function GameDataTableRow(props: GameDataTableRowProps): React.ReactElement {  
  const game: Game = props.game;
  const cellClassName: string | undefined = props.cellClassName

  return (
    <tr className={ props.rowClassName }>
      <td className={ cellClassName }>         
        <img
            alt={ game.name + ' thumbnail' }
            className='object-cover h-16 w-16 bg-slate-600'
            src={ props.game.thumbnail.toDisplayable("https://placehold.co/16") } />
      </td>
      <td className={ cellClassName }>{ game.id                     }</td>
      <td className={ cellClassName }>{ game.name                   }</td>
      <td className={ cellClassName }>{ game.desc                   }</td>
      <td className={ cellClassName }>{ game.emulator?.abbreviation }</td>
      <td className={ cellClassName }>{ game.category?.name         }</td>
      <td className={ cellClassName }>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            size='small'
            color='default'
            onClick={ () => { props.actions.edit(game) } }
            sx={{ p: '10px' }}
          >
            <IonIcon style={{color: '#FFFFFF'}} icon={ createOutline } />
          </IconButton>
          <IconButton 
            size='small'
            color='default'
            onClick={ () => { props.actions.delete(game) } } 
            sx={{ p: '10px' }}
          >
            <IonIcon style={{color: '#FFFFFF'}} icon={ trashOutline } />
          </IconButton>
        </Box>
      </td>
    </tr>
  )
}

