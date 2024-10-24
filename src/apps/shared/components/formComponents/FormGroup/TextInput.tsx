import StringFormatter from "@/libs/StringFormatter";
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
  const formatter: StringFormatter = new StringFormatter(props.name)
  const formatedName: string = formatter.replaceAll(' ', '-').toLowerCase()

  return (
    <div className={ 
        "flex items-center "
        + (props.backGroundColor ? " " + props.backGroundColor  : "bg-slate-200")
      }>
      <input ref={ ref } id={ formatedName } name={ formatedName } aria-label={ formatedName }
        placeholder={ props.name } type="text" defaultValue={ props.value } role="textbox"
        className={ 
          "py-2 front-lg focus:outline-none text-black flex-grow "
          + (props.backGroundColor ? " " + props.backGroundColor  : "bg-slate-200")
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
