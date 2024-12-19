import { forwardRef } from "react"

export enum SelectInputStyle {
  LABEL_LESS = 'LabelLess',
  REGULAR = 'Regular'
}
export type SelectInputSource = {
  value: any,
  name: string
}[];
type SelectInputProps = {
  source: SelectInputSource
  name: string,
  disabled?: boolean,
  className?: string,
  labelClassName?: string,
  styleType?: SelectInputStyle,
  containerClassName?: string,
  value?: string | number,
  hasSelectOption?: boolean
  onChange?: (value: string) => void
}

const SelectInput = forwardRef((props: SelectInputProps, ref: React.ForwardedRef<HTMLSelectElement>) => {  
  const styleType: SelectInputStyle = props.styleType ?? SelectInputStyle.REGULAR
  const source: SelectInputSource = props.hasSelectOption ? 
      [{ value: -1, name: '-- Selecione --' }, ...props.source] :
      props.source;

  switch (styleType) {
    case SelectInputStyle.LABEL_LESS:
      return <LabelLessSelectInput {...props} source={ source } ref={ ref } />
    case SelectInputStyle.REGULAR:
      return <RegularSelectInput {...props} source={ source } ref={ ref } />
  }
})
export default SelectInput;

const RegularSelectInput = forwardRef((props: SelectInputProps, ref: React.ForwardedRef<HTMLSelectElement>) => {
  return (
    <div className={ props.containerClassName }>      
      <label htmlFor={ props.name } className={ props.labelClassName }>{props.name}:</label>    
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
        disabled={ props.disabled }
        className={ props.className } >
      { 
        props.source.map((data, i) => <option key={i} value={ data.value }>{ data.name }</option>) 
      }
    </select>
  )
})
