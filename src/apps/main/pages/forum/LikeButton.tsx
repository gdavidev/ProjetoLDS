import { useState } from "react";
import { Button } from "@mui/material";
import { IonIcon } from '@ionic/react';
import { heartOutline, heart } from 'ionicons/icons';

type LikeButtonProps = {
  onClick?: () => void,
  checked?: boolean
  disabled?: boolean
}

export default function LikeButton(props: LikeButtonProps) {
  return (
    <Button 
      disabled={ props.disabled }
      onClick={ () => props.onClick?.() }
      startIcon={ <IonIcon icon={ props.checked ? heart : heartOutline } /> } />
  )
}