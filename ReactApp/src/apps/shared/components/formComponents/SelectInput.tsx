import { forwardRef } from "react"

type SelectInputProps = {
  defaultValue?: number,
  className?: string,
  source: [any, string][]
}

const SelectInput = forwardRef((props: SelectInputProps, ref: React.ForwardedRef<HTMLSelectElement>) => {  
  return (
    <select ref={ ref } className={ props.className } defaultValue={ props.defaultValue }>
      {
        props.source.map(data => 
          <option value={ data[0] }>
            { data[1] }
          </option>)
      }
    </select>
  )
});
export default SelectInput