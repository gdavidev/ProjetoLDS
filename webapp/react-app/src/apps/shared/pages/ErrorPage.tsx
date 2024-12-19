import { PropsWithoutRef, useLayoutEffect } from 'react';
import { Link } from "react-router-dom";

type ErrorPageProps = {
  code: number,
}

export default function ErrorPage(props: PropsWithoutRef<ErrorPageProps>) {
  useLayoutEffect(() => {
    document.title = "Erro 404";
  }, [])

  return (
    <div className="font-rubik flex flex-col gap-y-4 items-center justify-center w-screen h-screen">
      <div className="text-center">
        <h1 className="font-black text-2xl text-primary">{ props.code }</h1>
        <span className="font-bold text-md">
          { getStatusCodeMessage(props.code) }
        </span>
      </div>
      <Link to="/" aria-label="home-button" role="link" 
          className="btn-primary">
        Voltar para home
      </Link>
    </div>
  )
}

function getStatusCodeMessage(code: number): string {
  let message: string;
  switch (code) {
    case 404: 
      message = "Página não encontrada"; 
      break;
    case 500: 
      message = "Servidor em manutenção, por favor tente mais tarde"; 
      break;
    default:
      message = "Erro indefinido."
  }
  return message;
}