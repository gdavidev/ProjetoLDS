import ModalPopup, { ModalPopupData } from "../shared/components/ModalPopup"
import { Outlet } from "react-router-dom"
import SideMenu from "./components/layout/SideMenu"
import { createContext } from "react"

export type AdminContextProps = {
  setModalIsOpen: undefined | ((isOpen: boolean) => void),
  setModalData: undefined | ((data: ModalPopupData) => void),
}
const defaultAdminContextProps: AdminContextProps = {
  setModalIsOpen: undefined,
  setModalData: undefined,
}
export const AdminContext = createContext<AdminContextProps>(defaultAdminContextProps)

export default function AdminApp() {
  return (
    <AdminContext.Provider value={ defaultAdminContextProps }>      
      <div className="flex w-screen h-full min-h-screen bg-black">
        <SideMenu />
        <main className="mx-5 my-2 w-full h-full">
          <Outlet />
        </main>
      </div>
      <ModalPopup />
    </AdminContext.Provider>
  )
}