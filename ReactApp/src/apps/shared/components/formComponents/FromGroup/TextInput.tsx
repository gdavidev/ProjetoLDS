import { IonIcon } from "@ionic/react";
import { ChangeEventHandler, forwardRef } from "react";

type TextInputProps = {
  name: string,
  value?: string,
  ionIconPath?: string
  fontColor?: string,
  backGroundColor?: string,
  notValidMessage?: string,
  onChange?: ChangeEventHandler<HTMLInputElement>,
}

const TextInput = forwardRef((props: TextInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  const formatedName: string = props.name.replace(" ", "-").toLowerCase()
  const bgColor: string = props.backGroundColor || "bg-slate-200"

  return (
    <div className={ "flex items-center " + bgColor }>
      <input ref={ ref } id={ formatedName } name={ formatedName } aria-label={ props.name }
        placeholder={ props.name } type="text" defaultValue={ props.value } role="input"
        className={ 
          "py-2 front-lg focus:outline-none text-black flex-grow " + bgColor        
          + (props.fontColor       ? " " + props.fontColor  : "")
          + (props.notValidMessage ? " text-red-700"      : " text-black")
          + (props.ionIconPath     ? " ps-3"                : " px-3")
          }
          onChange={ props.onChange }/>
        { 
          props.ionIconPath ?
            <IonIcon className="w-12" icon={ props.ionIconPath } /> :
            ""
        }
    </div>
  );
})
export default TextInput
