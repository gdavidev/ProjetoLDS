import StringFormatter from "@libs/StringFormatter";
import { ChangeEventHandler } from "react";

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
  startDecoration?: JSX.Element,
  endDecoration?: JSX.Element,
  password?: boolean,
  styleType?: TextInputStyle,
  onChange?: ChangeEventHandler<HTMLInputElement>,
}

export default function TextInput(props: TextInputProps) {
  const styleType: TextInputStyle = props.styleType || TextInputStyle.REGULAR;

  switch (styleType) {
    case (TextInputStyle.LABEL_LESS):
      return LabelLessTextInput(props);
    default: // REGULAR
      return RegularTextInput(props);
  }
}

function RegularTextInput(props: TextInputProps) {
  return (
    <div className={ props.containerClassName }>
      <label htmlFor={ props.name }>{props.name}:</label>
      <LabelLessTextInput {...props} />
    </div>
  )
}

function LabelLessTextInput(props: TextInputProps) {
  const formatter: StringFormatter = new StringFormatter(props.name)
  const formatedName: string = formatter.replaceAll(' ', '-').toLowerCase()

  const makeInputClassName = (): string => 
    "py-2 front-lg focus:outline-none text-black flex-grow "
    + props.inputClassName
    + (!props.endDecoration ? " pe-3" : '')
    + (!props.startDecoration ? " ps-3" : '');
  
  const makeContainerClassName = (): string => 
    "flex items-center "
    + props.inputContainerClassName
    + (props.endDecoration ? " pe-3" : '')
    + (props.startDecoration ? " ps-3" : '');

  return (
    <div className={ makeContainerClassName() }>
      { props.startDecoration }

      <input id={ formatedName } name={ formatedName } aria-label={ formatedName } role="textbox"
        placeholder={ props.name } type={ props.password ? "password" : "text" } defaultValue={ props.value } 
        className={ makeInputClassName() } onChange={ props.onChange }/>

      { props.endDecoration }
    </div>
  );
}
