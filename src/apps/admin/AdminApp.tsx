import { Outlet } from "react-router-dom"
import SideMenu from "@apps/admin/components/layout/SideMenu"
import { Suspense } from "react";
import { CircularProgress } from "@mui/material";

const AdminApp = () => (
  <div className="flex w-screen h-full min-h-screen bg-black">
    <SideMenu />
    <main className="mx-5 my-2 w-full h-full">
      <Suspense fallback={ <div className="w-full h-full flex justify-center items-center"><CircularProgress color="primary" /></div> }>
        <Outlet />
      </Suspense>
    </main>
  </div>      
);
export default AdminApp;