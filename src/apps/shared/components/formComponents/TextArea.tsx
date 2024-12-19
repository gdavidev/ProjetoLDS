import StringFormatter from "@/libs/StringFormatter"
import { ChangeEventHandler, ForwardedRef, forwardRef } from 'react';

type TextAreaProps = {
  name: string,
  className?: string,
  disabled?: boolean,
  labelClassName?: string,
  value?: string,
  defaultValue?: string,
  resize?: ['none', 'both', 'vertical', 'horizontal'],
  onChange?: ChangeEventHandler<HTMLTextAreaElement>
}

const TextArea = forwardRef((props: TextAreaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
  const formatedName: string = StringFormatter.replaceAll(props.name, ' ', '-').toLowerCase()
  
  return (
    <div className="flex flex-col w-full">
      <label
          htmlFor={ formatedName }
          className={ props.labelClassName }>
        {props.name}:
      </label>
      <textarea
          ref={ ref }
          id={ formatedName }
          name={ formatedName }
          disabled={ props.disabled }
          className={ "input-text " + props.className }
          onChange={ props.onChange }
          defaultValue={ props.defaultValue }
          value={ props.value }
      />
    </div>
  )
})
export default TextArea