import { useState } from "react"

type CheckBoxProps = {
  name: string
  label: string
  isChecked?: boolean
  className?: string
}

export default function CheckBox(props: CheckBoxProps) {
  const [ isChecked, setIsChecked ] = useState(props.isChecked);

  return (
    <div className={ "flex align-center cursor-pointer " + (props.className ?? '') } 
        onClick={ (e) => { setIsChecked(!isChecked); e.preventDefault() } }>
      <input type="checkbox" 
          className="w-5 h-5 me-2"
          id={ props.name } 
          name={ props.name } 
          checked={ isChecked } />      
      <label htmlFor={ props.name }
          className="cursor-pointer">
        { props.label }
      </label>
    </div>
  )
}