import StringFormatter from "@/libs/StringFormatter"
import { ChangeEventHandler, ForwardedRef, forwardRef } from 'react';

type TextAreaProps = {
  name: string,
  className?: string
  labelClassName?: string,
  value?: string,
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
          className={ "text-input " + props.className }
          onChange={ props.onChange }
          defaultValue={ props.value }
      />
    </div>
  )
})
export default TextArea