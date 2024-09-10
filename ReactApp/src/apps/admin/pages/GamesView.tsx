import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Game from '../../../models/Game';
import { IonIcon } from '@ionic/react'
import { add, createOutline, trashOutline } from 'ionicons/icons';
import TableDisplay from '../components/TableDisplay';
import GameEditModalContent from './modalEditContent/GameEditModalContent';
import { AdminContext, AdminContextProps } from '../AdminApp';
import { ModalPopupData } from '../../shared/components/ModalPopup';
import GameApiClient from '../../../api/GameApiClient';
import { GameGetDTO } from '../../../models/GameDTOs';

export default function GamesView() {
  const adminContext: AdminContextProps = useContext(AdminContext)
  const [ gameList, setGameData ] = useState<Game[]>([]);
  useEffect(() => {
    fetchGameData();
  }, [])

  function fetchGameData() {
    const gameApiClient: GameApiClient = new GameApiClient()
    gameApiClient.getAll<GameGetDTO>()
      .then(data => {
        console.log(data)
        const resultGameList: Game[] = data.map(gameDTO => Game.fromGetDTO(gameDTO));
        console.log(resultGameList)
        setGameData(resultGameList);
      });
  }

  function openGameEditModal(game?: Game) {    
    let modalData: ModalPopupData
    if (game) {
      modalData = {
        title: "Editar Jogo",
        modalContentEl: <GameEditModalContent game={ game }
          onChange={ (newGame: Game) => { updateGameOnGameList(newGame) } } />,
      }
    } else {
      modalData = {
        title: "Adicionar Jogo",
        modalContentEl: <GameEditModalContent 
          onChange={ (newGame: Game) => appendGameOnGameList(newGame) } />,
      }
    }
    adminContext.setModalData?.(modalData)
    adminContext.setModalIsOpen?.(true)
  }

  const appendGameOnGameList = (newGame: Game): void => {
    setGameData(gd => [...gd, newGame])
  }
  const updateGameOnGameList = (updatedGame: Game) => {
    const indexOfGame: number = getGameindex(updatedGame)
    if (indexOfGame !== -1)
      gameList[indexOfGame] = updatedGame
  }
  const deleteGameOnGameList = (deletedGame: Game) => {
    const indexOfGame: number = getGameindex(deletedGame)
    if (indexOfGame !== -1)
      gameList.splice(indexOfGame, 1)
  }
  function getGameindex(targetGame: Game): number {
    return gameList.findIndex(game => game.id === targetGame.id)
  }

  const templateHeader: {colName: string, colWidth: string}[] = [
    {colName: ''      , colWidth: '80px'  },
    {colName: '#'           , colWidth: '30px'  },
    {colName: 'Name'        , colWidth: '280px' },
    {colName: 'Description' , colWidth: '100%'  }, 
    {colName: ''            , colWidth: '120px' }
  ]

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mx-5 text-white">
        <h2 className="font-rubik font-bold">Lista de Jogos</h2>
        <button className='btn-r-md bg-primary hover:bg-primary-dark text-white'
            onClick={ () => openGameEditModal() }>
          <IonIcon icon={ add } /> Novo Jogo
        </button>
      </div>
      <TableDisplay headerTemplateLabels={ templateHeader } 
          tableStyleObject={{width: '100%'}}
          tableHeaderClassName='text-white font-rubik font-bold text-center'>
        { 
          gameList && 
            gameList.map((game: Game, index: number) => {
              return ( 
                <GameDataTableRow key={index} game={ game }
                  rowClassName="bg-primary-light text-white"
                  cellClassName='first:rounded-s-md last:rounded-e-md'
                  actions={{ edit: openGameEditModal, delete: deleteGameOnGameList }} />
              )
            })            
        }
      </TableDisplay>
    </div>
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
  let thumbnailEl: React.ReactElement<HTMLImageElement> | undefined
  // if (props.game.thumbnail) {
  //   let renderer = new FileReader()
  //   renderer.onload = (e) => {
  //     const imgSrc: string = e.target?.result as string;
  //     thumbnailEl = <img src={ imgSrc } />      
  //   }
  //   renderer.readAsDataURL(props.game.thumbnail)
  //   //thumbnailEl = Buffer.from(props.game.thumbnail).toString('base64')
  // }

  return (
    <tr className={ props.rowClassName }>
      <td className={ props.cellClassName }>         
        { thumbnailEl ? thumbnailEl : '' }
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="sm" variant="plain" color="neutral" 
              onClick={ () => { props.actions.edit(props.game) } } >
            <IonIcon icon={ createOutline } />
          </Button>
          <Button size="sm" variant="plain" color="danger"
             onClick={ () => { props.actions.delete(props.game) } } >
            <IonIcon icon={ trashOutline } />
          </Button>
        </Box>
      </td>
    </tr>
  )
}

