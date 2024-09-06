import { useContext, useState } from "react"
import { Link } from "react-router-dom"

import { MainContext, MainProps } from "../../../shared/context/MainContextProvider"
import { IonIcon } from '@ionic/react'
import { home, gameController, person, exit } from 'ionicons/icons';

export default function SideMenu() {
  const context: MainProps = useContext(MainContext)
  
  return (
    <aside className="flex flex-col h-screen w-1/5 py-5 bg-primary-dark font-rubik">
      <div className="mx-auto text-white">        
        <h1 className="border-s-4 border-s-red-700">CRUD</h1>
        <h2>{ context.currentUser.userName || "User" }</h2>
        <span>Admin</span>        
      </div>
      <div className="flex flex-col h-full justify-between">
        <div>          
          <Link to="/admin/view-games" 
              className="btn-r-md flex justify-start bg-primary-dark hover:bg-primary gap-x-2 w-48">
            <IonIcon icon={ home } /> Games
          </Link>
          <Link to="/admin/view-emulators" 
              className="btn-r-md flex justify-start bg-primary-dark hover:bg-primary gap-x-2 w-48">
            <IonIcon icon={ gameController } /> Emulators
          </Link>
          <Link to="/admin/view-users" 
              className="btn-r-md flex justify-start bg-primary-dark hover:bg-primary gap-x-2 w-48">
            <IonIcon icon={ person } /> Users
          </Link>        
        </div>
        <Link to="/admin/view-users" 
            className="btn-r-md flex justify-start bg-primary-dark hover:bg-primary gap-x-2 w-48">
          <IonIcon icon={ exit } /> Sair
        </Link>        
      </div>
    </aside>
  )
}

