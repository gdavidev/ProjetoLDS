import StringFormatter from "@/libs/StringFormatter"
import { ForwardedRef, forwardRef } from "react"

type TextAreaProps = {
  name: string,
  className: string
  labelClassName?: string,
  value?: string,
  resize?: ['none', 'both', 'vertical', 'horizontal'],
  onChange?: (value: string) => void
}

const TextArea = forwardRef((props: TextAreaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
  const formatedName: string = StringFormatter.replaceAll(props.name, ' ', '-').toLowerCase()
  
  return (
    <div className="flex flex-col">
      <label htmlFor={ formatedName } className={ props.labelClassName }>{props.name}:</label>
      <textarea id={ formatedName } name={ formatedName }
        className={ "text-input " + props.className }
        onChange={ (e) => props.onChange?.(e.target.value) }
        defaultValue={ props.value }
        ref={ ref } />
    </div>
  )
})
export default TextArea