import React from 'react';
import Table from '@mui/joy/Table';

type TableDisplayProps = {
  tableStyleObject?: React.CSSProperties,
  tableHeaderClassName?: string,
  headerTemplateLabels: {
    colName: string,
    colWidth: string,
  }[],
  children?: JSX.Element | JSX.Element[],
}

export default function TableDisplay(props: TableDisplayProps) {  
  return (
    <Table stickyHeader sx={ props.tableStyleObject }>
      <thead>
        <tr className={ props.tableHeaderClassName }>
          { 
            props.headerTemplateLabels.map((headerTemplateLabel, index) => 
              <td key={ index } style={{width: headerTemplateLabel.colWidth}}>
                { headerTemplateLabel.colName }
              </td>)
          }
        </tr>              
      </thead>
      <tbody>
        { props.children }
      </tbody>
    </Table>
  );

}