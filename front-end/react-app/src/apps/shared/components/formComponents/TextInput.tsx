import StringFormatter from "@libs/StringFormatter";
import { ChangeEventHandler, forwardRef } from "react";

export enum TextInputStyle {
  LABEL_LESS = 'LabelLess',
  REGULAR = 'Regular'
}
type TextInputProps = {
  name: string,
  value?: string,
  containerClassName?: string,
  inputContainerClassName?: string,
  inputClassName?: string,
  labelClassName?: string,
  startDecoration?: JSX.Element,
  endDecoration?: JSX.Element,
  password?: boolean,
  styleType?: TextInputStyle,
  onChange?: ChangeEventHandler<HTMLInputElement>,
}

const TextInput = forwardRef((props: TextInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  const styleType: TextInputStyle = props.styleType || TextInputStyle.REGULAR;

  switch (styleType) {
    case (TextInputStyle.LABEL_LESS):
      return <LabelLessTextInput {...props} ref={ ref } />;
    default: // REGULAR
      return <RegularTextInput {...props} ref={ ref } />;
  }
})
export default TextInput;

const RegularTextInput = forwardRef((props: TextInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  return (
    <div className={ props.containerClassName }>
      <label htmlFor={ props.name } className={ props.labelClassName }>{props.name}:</label>
      <LabelLessTextInput {...props} ref={ ref } />
    </div>
  );
})

const LabelLessTextInput = forwardRef((props: TextInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  const formatter: StringFormatter = new StringFormatter(props.name)
  const formatedName: string = formatter.replaceAll(' ', '-').toLowerCase()

  const makeInputClassName = (): string => 
    (props.inputClassName ?? '')
    + ' py-2 front-lg text-black flex-grow'
    + (props.styleType === TextInputStyle.LABEL_LESS ? ' focus:outline-none' : '')
    + (!props.endDecoration ? ' pe-3' : '')
    + (!props.startDecoration ? ' ps-3' : '');
  
  const makeContainerClassName = (): string => 
    "flex items-center "
    + props.inputContainerClassName
    + (props.endDecoration ? " pe-3" : '')
    + (props.startDecoration ? " ps-3" : '');

  return (
    <div className={ makeContainerClassName() }>
      { props.startDecoration }

      <input role="textbox"
          ref={ ref }
          id={ formatedName }
          name={ formatedName }
          className={ makeInputClassName() }
          onChange={ props.onChange }
          aria-label={ formatedName }
          placeholder={ props.name }
          type={ props.password ? "password" : "text" }
          defaultValue={ props.value } />

      { props.endDecoration }
    </div>
  );
})
