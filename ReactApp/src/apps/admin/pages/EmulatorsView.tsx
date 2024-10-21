import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import { IonIcon } from '@ionic/react'
import { add, createOutline, trashOutline, reloadOutline } from 'ionicons/icons';
import TableDisplay from '../components/TableDisplay';
import { MainContext, MainContextProps } from '@shared/context/MainContextProvider';
import { useMutation } from 'react-query';
import { IconButton } from '@mui/joy';
import Emulator from '@/models/Emulator';
import EmulatorApiClient from '@/api/EmulatorApiClient';
import EmulatorEditModal from './modal/EmulatorEditModal';

export default function EmulatorsView() {
  const mainContext: MainContextProps = useContext(MainContext);
  const [ emulatorModalEmulator , setEmulatorModalEmulator  ] = useState<Emulator>(new Emulator());
  const [ isEmulatorModalOpen   , setIsEmulatorModalOpen    ] = useState<boolean>(false);
  const [ emulatorList          , setEmulatorList           ] = useState<Emulator[]>([]);

  useEffect(() => {
    fetchEmulatorData();
  }, [])

  function fetchEmulatorData() {
    const emulatorApiClient: EmulatorApiClient = new EmulatorApiClient()
    emulatorApiClient.getAll()
      .then(data => {        
        data.sort((prev: Emulator, curr: Emulator) => prev.id - curr.id)
        setEmulatorList(data);
      });
  }

  const { mutate: deleteEmulator } = useMutation('delete-game',
    async (emulator: Emulator) => {
      const emulatorApiClient: EmulatorApiClient = new EmulatorApiClient(mainContext.currentUser?.token!);
      return await emulatorApiClient.delete(emulator);
    },
    {
      onSuccess: (_, emulator) => deleteEmulatorOnEmulatorList(emulator.id),
      onError: (err: any) => console.log("err: " + JSON.stringify(err)),
    }
  );

  function addEmulator() {
    setEmulatorModalEmulator(new Emulator());
    setIsEmulatorModalOpen(true);
  }
  function editEmulator(emulator: Emulator) {
    setEmulatorModalEmulator(emulator);
    setIsEmulatorModalOpen(true);
  } 
      
  const appendEmulatorOnEmulatorList = (newEmulator: Emulator): void => {
    setEmulatorList(gd => [...gd, newEmulator])
  }
  const deleteEmulatorOnEmulatorList = (deletedEmulatorId: number): void => {
    setEmulatorList(list => list.filter(game => game.id !== deletedEmulatorId))
  }
  const updateEmulatorOnEmulatorList = (updatedEmulator: Emulator) => {
    setEmulatorList(list => {
        return list.map(game => game.id === updatedEmulator.id ? game = updatedEmulator : game )
    })
  }

  const templateHeader: {colName: string, colWidth: string}[] = [
    {colName: '#'          , colWidth: '30px'  },
    {colName: 'Console'    , colWidth: '100%'  },
    {colName: 'Empresa'    , colWidth: '120px' },
    {colName: 'Abreviação' , colWidth: '160px' }, 
    {colName: ''           , colWidth: '120px' }
  ]

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mx-5 text-white">
          <h2 className="font-rubik font-bold">Lista de Jogos</h2>
          <div className="flex gap-x-2 ">
            <IconButton variant="solid" color="neutral" onClick={ fetchEmulatorData } >
              <IonIcon icon={ reloadOutline } />
            </IconButton>
            <button className='btn-r-md bg-primary hover:bg-primary-dark text-white'
                onClick={ addEmulator }>
              <IonIcon icon={ add } /> Novo Jogo
            </button>
          </div>
        </div>
        <TableDisplay headerTemplateLabels={ templateHeader } 
            tableStyleObject={{width: '100%', borderSpacing: '0 3px'}}
            tableHeaderClassName='text-white font-rubik font-bold'>
          { 
            emulatorList.map((emulator: Emulator, index: number) => {
                return ( 
                  <EmulatorDataTableRow key={index} emulator={ emulator }
                    rowClassName="bg-primary-light text-white"
                    cellClassName='first:rounded-s-md last:rounded-e-md'
                    actions={{
                      edit: editEmulator, 
                      delete: (emulator: Emulator) => deleteEmulator(emulator)
                    }} />
                )
              })            
          }
        </TableDisplay>
      </div>
      <EmulatorEditModal emulator={ emulatorModalEmulator }
          onCloseRequest={ () => { setIsEmulatorModalOpen(false) } } isOpen={ isEmulatorModalOpen } 
          onChange={ emulatorModalEmulator.id === 0 ? 
                appendEmulatorOnEmulatorList :
                updateEmulatorOnEmulatorList } />
    </>
  );
}

type EmulatorDataTableRowProps = {
  rowClassName?: string,
  cellClassName?: string,
  emulator: Emulator,
  actions: { 
    edit: (emulator: Emulator) => void,
    delete: (emulator: Emulator) => void,
  }
}
function EmulatorDataTableRow(props: EmulatorDataTableRowProps): React.ReactElement {  
  return (
    <tr className={ props.rowClassName }>
      <td className={ props.cellClassName }>
        { props.emulator.id   }
      </td>
      <td className={ props.cellClassName }>
        { props.emulator.console }
      </td>
      <td className={ props.cellClassName }>
        { props.emulator.abbreviation }
      </td>
      <td className={ props.cellClassName }>
        { props.emulator.companyName }
      </td>
      <td className={ props.cellClassName }>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="sm" variant="plain" 
              onClick={ () => { props.actions.edit(props.emulator) } } >
            <IonIcon style={{color: '#FFFFFF'}} icon={ createOutline } />
          </Button>
          <Button size="sm" variant="plain"
             onClick={ () => { props.actions.delete(props.emulator) } } >
            <IonIcon style={{color: '#FFFFFF'}} icon={ trashOutline } />
          </Button>
        </Box>
      </td>
    </tr>
  )
}

