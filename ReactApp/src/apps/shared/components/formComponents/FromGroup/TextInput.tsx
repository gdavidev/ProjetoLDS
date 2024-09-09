import { ChangeEventHandler, forwardRef, ReactNode, RefObject } from "react";

type TextInputProps = {
  name: string,
  value?: string,
  iconEl?: ReactNode
  fontColor?: string,
  backGroundColor?: string,
  notValidMessage?: string,
  onChange?: ChangeEventHandler<HTMLInputElement>,
}

const TextInput = forwardRef((props: TextInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  const formatedName: string = props.name.replace(" ", "-").toLowerCase()

  return (
    <input ref={ ref } id={ formatedName } name={ formatedName } 
      placeholder={ props.name } type="text" defaultValue={ props.value }
      className={ 
        "px-3 py-2 front-lg focus:outline-none text-black"
        + (props.backGroundColor !== 'undefined' ? " " + props.backGroundColor : "")
        + (props.fontColor       !== 'undefined' ? " " + props.fontColor       : "")
        + (props.notValidMessage !== 'undefined' && props.notValidMessage !== '' ? 
            " " + "text-red-700"    : "text-black")        
       }
       onChange={ props.onChange }/>
  );
})
export default TextInput
