import React, { useContext, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Game from '../../../models/Game';
import { IonIcon } from '@ionic/react'
import { add } from 'ionicons/icons';
import Axios from 'axios';
import TableDisplay from '../components/TableDisplay';
import GameEditModalContent from './modalEditContent/GameEditModalContent';
import { AdminContext, AdminContextProps } from '../AdminApp';
import { ModalPopupData } from '../../shared/components/ModalPopup';

const gameData: Game[] = [];

export default function GamesView() {
  const adminContext: AdminContextProps = useContext(AdminContext)
  let gamesTableRows: React.ReactElement[] = [];
  useEffect(() => {
    fetchGameData();
    setupModalContent();
  }, [])

  function fetchGameData() {
    Axios.get<Game | Game[]>('http://localhost:8080/api/roms/')
      .then(response => { 
        if (Array.isArray(response.data))
          response.data.map((data: Game, index: number): void => {
            gamesTableRows[index] = gameToTableRow(index, data)
          })
        else
          gamesTableRows[0] = gameToTableRow(0, response.data)
      });
  }

  function setupModalContent() {
    const modalData: ModalPopupData = {
      title: "Adicionar Jogo",
      modalContentEl: <GameEditModalContent />,
    }
    adminContext.setModalData?.(modalData)
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mx-5 text-white">
        <h2 className="font-rubik font-bold">Lista de Jogos</h2>
        <button className='btn-r-md bg-primary hover:bg-primary-dark text-white'
            onClick={ () => { adminContext.setModalIsOpen?.(true) } }>
          <IonIcon icon={ add } /> Novo Jogo
        </button>
      </div>
      <TableDisplay headerNames={['#', 'Name', 'Description', 'filePath', 'thumbnail', 'Actions']} >
        { gamesTableRows }
      </TableDisplay>
    </div>
  );
}

function gameToTableRow(rowNum: number, game: Game): React.ReactElement {
  return (
    <tr key={ rowNum }>
      <td>{ game.id               }</td>
      <td>{ game.name             }</td>
      <td>{ game.desc             }</td>
      <td>{ game.file?.name       }</td>
      <td>{ game.thumbnail?.name  }</td>
      <td>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="sm" variant="plain" color="neutral">
            Editar
          </Button>
          <Button size="sm" variant="soft" color="danger">
            Deletar
          </Button>
        </Box>
      </td>
    </tr>
  )
}

