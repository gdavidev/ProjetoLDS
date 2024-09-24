import { Outlet } from "react-router-dom"
import SideMenu from "@apps/admin/components/layout/SideMenu"

const AdminApp = () => (
  <div className="flex w-screen h-full min-h-screen bg-black">
    <SideMenu />
    <main className="mx-5 my-2 w-full h-full">
      <Outlet />
    </main>
  </div>      
);
export default AdminApp;