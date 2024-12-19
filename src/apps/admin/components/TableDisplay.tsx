import React from 'react';
import Table from '@mui/material/Table';

type TableDisplayProps = {
  tableStyleObject?: React.CSSProperties,
  tableHeaderClassName?: string,
  headerTemplate: {
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
            props.headerTemplate.map((headerTemplate, index) => 
              <td key={ index } style={{minWidth: headerTemplate.colWidth}}>
                { headerTemplate.colName }
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