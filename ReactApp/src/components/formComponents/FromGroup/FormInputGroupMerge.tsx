import { ReactNode } from "react";

type FormInputGroupMergeProps = {
  children: ReactNode | ReactNode[]
}

export default function FormInputGroupMerge(props: FormInputGroupMergeProps) {
  return(
    <div className="flex flex-col rounded-md overflow-hidden">
      { props.children }
    </div>
  )
}