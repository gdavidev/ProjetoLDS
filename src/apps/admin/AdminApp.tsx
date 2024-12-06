import { Outlet } from "react-router-dom"
import SideMenu from "@apps/admin/components/layout/SideMenu"
import { Suspense, useEffect } from 'react';
import { CircularProgress } from "@mui/material";
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import useCurrentUser from '@/hooks/useCurrentUser.ts';
import { Role } from '@/hooks/usePermission.ts';

export default function AdminApp() {
  const { user } = useCurrentUser();
  const { exit } = useEmergencyExit();

  useEffect(() => {
    if (!user || user.role !== Role.ADMIN)
      exit('/', 'Você não tem permissão para acessar essa pagina.');
  }, []);

  return (
    <div className="flex w-screen h-full min-h-screen bg-black">
      <SideMenu />
      <main className="mx-5 my-2 w-full h-full">
        <Suspense fallback={ <div className="w-full h-full flex justify-center items-center"><CircularProgress color="primary" /></div> }>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}