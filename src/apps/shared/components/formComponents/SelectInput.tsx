import { forwardRef } from "react"

export enum SelectInputStyle {
  LABEL_LESS = 'LabelLess',
  REGULAR = 'Regular'
}
type SelectInputProps = {
  source: [any, string][]
  name: string,
  className?: string,
  styleType?: SelectInputStyle,
  containerClassName?: string,
  value?: string | number,
  onChange?: (value: string) => void
}

const SelectInput = forwardRef((props: SelectInputProps, ref: React.ForwardedRef<HTMLSelectElement>) => {  
  const styleType: SelectInputStyle = props.styleType ?? SelectInputStyle.REGULAR

  switch (styleType) {
    case SelectInputStyle.LABEL_LESS:
      return <LabelLessSelectInput {...props} ref={ ref } />
    case SelectInputStyle.REGULAR:
      return <RegularSelectInput {...props} ref={ ref } />
  }
})
export default SelectInput;

const RegularSelectInput = forwardRef((props: SelectInputProps, ref: React.ForwardedRef<HTMLSelectElement>) => {
  return (
    <div className={ props.containerClassName }>      
      <label htmlFor={ props.name }>{props.name}:</label>      
      <LabelLessSelectInput {...props} ref={ ref } />
    </div>
  )
})

const LabelLessSelectInput = forwardRef((props: SelectInputProps, ref: React.ForwardedRef<HTMLSelectElement>) => {
  return (
    <select name={ props.name } 
        ref={ ref }
        onChange={ (e) => props.onChange?.(e.target.value) }
        defaultValue={ props.value }
        className={ props.className } >
      { 
        props.source.map((data, i) => data[0] == props.value ?
          <option key={i} value={ data[0] } selected={ true }>{ data[1] }</option> :
          <option key={i} value={ data[0] }>{ data[1] }</option>
        ) 
      }
    </select>
  )
})
