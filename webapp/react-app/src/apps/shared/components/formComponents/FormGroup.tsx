import { ReactNode } from "react";

type FormGroupProps = {
  children: ReactNode | ReactNode[]
}

export default function FormGroup(props: FormGroupProps) {
  return(
    <div className="flex flex-col rounded-md overflow-hidden">
      { props.children }
    </div>
  )
}