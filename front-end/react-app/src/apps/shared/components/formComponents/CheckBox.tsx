import { useState } from "react"

type CheckBoxProps = {
  name: string
  label: string
  isChecked?: boolean
  className?: string
}

export default function CheckBox(props: CheckBoxProps) {
  const [ isChecked, setIsChecked ] = useState<boolean>(props.isChecked ?? false);

  return (
    <div
      className={ "flex items-center cursor-pointer " + (props.className ?? '') }
      onClick={ (e) => {
          setIsChecked(!isChecked);
          e.stopPropagation();
        }
      }>
      <input type="checkbox" 
        className="w-5 h-5 me-2"
        id={ props.name }
        name={ props.name }
        defaultChecked={ isChecked }
        onClick={ (e) => {
          e.stopPropagation();
        }
      }/>
      <label htmlFor={ props.name }
          className="cursor-pointer">
        { props.label }
      </label>
    </div>
  )
}