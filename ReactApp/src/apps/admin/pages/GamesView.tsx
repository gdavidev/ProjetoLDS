import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Game from '@models/Game';
import { IonIcon } from '@ionic/react'
import { add, createOutline, trashOutline, reloadOutline } from 'ionicons/icons';
import TableDisplay from '../components/TableDisplay';
import GameEditModal from './modal/GameEditModal';
import GameApiClient from '@api/GameApiClient';
import { GameGetDTO } from '@models/GameDTOs';
import { MainContext, MainContextProps } from '@shared/context/MainContextProvider';
import FileUtil from '@libs/FileUtil';
import { useMutation } from 'react-query';
import { IconButton } from '@mui/joy';

export default function GamesView() {
  const mainContext: MainContextProps = useContext(MainContext);
  const [ gameModalGame   , setGameModalGame   ] = useState<Game>(new Game());
  const [ isGameModalOpen , setIsGameModalOpen ] = useState<boolean>(false);
  const [ gameList        , setGameList        ] = useState<Game[]>([]);
  useEffect(() => {
    fetchGameData();
  }, [])

  function fetchGameData() {
    const gameApiClient: GameApiClient = new GameApiClient()
    gameApiClient.getAll<GameGetDTO>()
      .then(data => {
        let resultGameList: Game[] = data.map(gameDTO => Game.fromGetDTO(gameDTO));
        resultGameList.sort((prev: Game, curr: Game) => prev.id - curr.id)
        setGameList(resultGameList);
      });
  }

  const { mutate: deleteGame } = useMutation('delete-game',
    async (gameId: number) => {
      const gameApiClient: GameApiClient = new GameApiClient();
      gameApiClient.setToken(mainContext.currentUser?.token!)
      return await gameApiClient.delete(gameId);
    },
    {
      onSuccess: (_, gameId) => deleteGameOnGameList(gameId),
      onError: (err: any) => console.log("err: " + JSON.stringify(err)),
    }
  );

  function addGame() {
    setGameModalGame(new Game());
    setIsGameModalOpen(true);
  }
  function editGame(game: Game) {
    setGameModalGame(game);
    setIsGameModalOpen(true);
  }
      
  const appendGameOnGameList = (newGame: Game): void => {
    setGameList(gd => [...gd, newGame])
  }
  const deleteGameOnGameList = (deletedGameId: number): void => {
    setGameList(list => list.filter(game => game.id !== deletedGameId))
  }
  const updateGameOnGameList = (newGame: Game) => {
    const oldGame: Game | undefined = gameList.find(game => game.id === newGame.id)
    if (oldGame) {
      const updatedGame: Game = newGame
      if (updatedGame.thumbnail === undefined && oldGame.thumbnail !== undefined)
        updatedGame.thumbnail = oldGame.thumbnail
      if (updatedGame.file === undefined && oldGame.file !== undefined)
        updatedGame.file = oldGame.file

      setGameList(list => {
        return list.map(game => game.id === updatedGame.id ? game = updatedGame : game )
      })
    }
  }

  const templateHeader: {colName: string, colWidth: string}[] = [
    {colName: ''            , colWidth: '80px'  },
    {colName: '#'           , colWidth: '30px'  },
    {colName: 'Name'        , colWidth: '280px' },
    {colName: 'Description' , colWidth: '100%'  },
    {colName: 'Emulador'    , colWidth: '160px' }, 
    {colName: ''            , colWidth: '120px' }
  ]

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mx-5 text-white">
          <h2 className="font-rubik font-bold">Lista de Jogos</h2>
          <div className="flex gap-x-2 ">
            <IconButton variant="solid" color="neutral" onClick={ fetchGameData } >
              <IonIcon icon={ reloadOutline } />
            </IconButton>
            <button className='btn-r-md bg-primary hover:bg-primary-dark text-white'
                onClick={ addGame }>
              <IonIcon icon={ add } /> Novo Jogo
            </button>
          </div>
        </div>
        <TableDisplay headerTemplateLabels={ templateHeader } 
            tableStyleObject={{width: '100%', borderSpacing: '0 3px'}}
            tableHeaderClassName='text-white font-rubik font-bold'>
          { 
            gameList.map((game: Game, index: number) => {
                return ( 
                  <GameDataTableRow key={index} game={ game }
                    rowClassName="bg-primary-light text-white"
                    cellClassName='first:rounded-s-md last:rounded-e-md'
                    actions={{
                      edit: editGame, 
                      delete: (game: Game) => deleteGame(game.id)
                    }} />
                )
              })            
          }
        </TableDisplay>
      </div>
      <GameEditModal game={ gameModalGame } isOpen={ isGameModalOpen } onClose={ () => { setIsGameModalOpen(false) } }
          onChange={ gameModalGame.id === 0 ? appendGameOnGameList : updateGameOnGameList } />
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
  let source: string
  if (props.game.thumbnailBase64) {
    source = 'data:image/jpeg;base64,' + props.game.thumbnailBase64
  } else if (props.game.thumbnail) {
    source = FileUtil.uploadedFileToURL(props.game.thumbnail);    
  } else {
    source = "https://placehold.co/16"
  }

  return (
    <tr className={ props.rowClassName }>
      <td className={ props.cellClassName }>         
      <img className='max-w-16 min-h-16 bg-slate-600' src={ source } />
      </td>
      <td className={ props.cellClassName }>
        { props.game.id   }
      </td>
      <td className={ props.cellClassName }>
        { props.game.name }
      </td>
      <td className={ props.cellClassName }>
        { props.game.desc }
      </td>
      <td className={ props.cellClassName }>
        { props.game.emulator }
      </td>
      <td className={ props.cellClassName }>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="sm" variant="plain" 
              onClick={ () => { props.actions.edit(props.game) } } >
            <IonIcon style={{color: '#FFFFFF'}} icon={ createOutline } />
          </Button>
          <Button size="sm" variant="plain"
             onClick={ () => { props.actions.delete(props.game) } } >
            <IonIcon style={{color: '#FFFFFF'}} icon={ trashOutline } />
          </Button>
        </Box>
      </td>
    </tr>
  )
}

