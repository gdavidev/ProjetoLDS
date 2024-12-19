import { Outlet } from "react-router-dom"
import SideMenu from "@apps/admin/components/layout/SideMenu"
import { Suspense, useEffect } from 'react';
import useEmergencyExit from '@/hooks/useEmergencyExit.ts';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Role } from '@/hooks/usePermission.ts';
import Loading from '@shared/components/Loading.tsx';

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
        <Suspense fallback={ <Loading className='centered' /> }>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}