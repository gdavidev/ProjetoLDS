import { Outlet } from 'react-router-dom';

import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import './App.css';

export default function App() {
  return (
    <>
      <Header isUserAuth={false} />
      <main className="p-16 w-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}