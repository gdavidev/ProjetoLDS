import { IonIcon } from "@ionic/react";
import { logoDiscord, logoFacebook, logoInstagram, logoTwitter } from "ionicons/icons";

export default function Footer() {
  return (
    <footer className={ "flex flex-col gap-y-5 px-32 pt-16 pb-12 text-start text-white " +
        "bg-layout-background border-t-primary border-t-2"} >
      <div className="flex flex-row gap-x-8">
        <span className="font-bold text-lg">Contate nos:</span>
        <div className="flex flex-row gap-x-3 items-center">
          <a href="#"><IonIcon className="w-6 h-6" icon={ logoInstagram } /></a>
          <a href="#"><IonIcon className="w-6 h-6" icon={ logoFacebook } /></a>
          <a href="#"><IonIcon className="w-6 h-6" icon={ logoTwitter } /></a>
          <a href="#"><IonIcon className="w-6 h-6" icon={ logoDiscord } /></a>
        </div>
      </div>
      <div className="flex flex-col gap-x-5 gap-y-1.5 justify-start">
        <span className="font-bold text-lg">Suporte:</span>
        <a className="focus:outline-none text-sm" href="#">Central de Suporte</a>
        <a className="focus:outline-none text-sm" href="#">Termos e Condições</a>
        <a className="focus:outline-none text-sm" href="#">Privacidade & Cookies</a>
      </div>
    </footer>
  );
}