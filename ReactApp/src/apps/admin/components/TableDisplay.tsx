import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';

type TableDisplayProps = {
  headerNames: string[],
  children?: JSX.Element | JSX.Element[],
}

export default function TableDisplay(props: TableDisplayProps) {  
  return (
    <div>
      <Sheet sx={(theme) => ({
          '--TableCell-height': '40px',
          '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
          height: 200,
          overflow: 'auto',
          backgroundSize: '100% 40px, 100% 40px, 100% 14px, 100% 14px',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'local, local, scroll, scroll',
          backgroundPosition: '0 var(--TableHeader-height), 0 100%, 0 var(--TableHeader-height), 0 100%',
          backgroundColor: 'background.surface',
          background: `linear-gradient(${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
            linear-gradient(rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
            radial-gradient(
              farthest-side at 50% 0,
              rgba(0, 0, 0, 0.12),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
                farthest-side at 50% 100%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              )
              0 100%`,
        })}>
        <Table stickyHeader>
          <thead>
            <tr>
              { 
                props.headerNames.map((text, index) => 
                  <td key={ index }>{ text }</td>)
              }
            </tr>              
          </thead>
          <tbody>
            { props.children }
          </tbody>
        </Table>
      </Sheet>
    </div>
  );

}