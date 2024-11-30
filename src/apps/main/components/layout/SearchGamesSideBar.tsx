import CheckBox from '@apps/shared/components/formComponents/CheckBox';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { IonIcon } from '@ionic/react';
import { chevronForwardOutline, filterOutline } from 'ionicons/icons';
import { AccordionProps } from '@mui/material/Accordion';
import { accordionSummaryClasses, AccordionSummaryProps } from '@mui/material/AccordionSummary';
import useCategories, { CategoryType } from '@/hooks/useCategories.ts';
import useEmulators from '@/hooks/useEmulators.ts';

const AccordionStyled = (props: AccordionProps) => (
  <Accordion {...props}
    disableGutters
    sx={{
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      boxShadow: 'none',
    }} />
);
const AccordionSummaryStyled = (props: AccordionSummaryProps) => (
    <AccordionSummary {...props}
      expandIcon={ <IonIcon style={{color: 'white'}} icon={ chevronForwardOutline } /> }
      sx={{
        display: 'flex',
        flexDirection: 'row-reverse',
        columnGap: '0.5rem',
        [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
          transform: 'rotate(90deg)',
        }
      }} />
);

export default function SearchGamesSideBar() {
  const { data: categories } = useCategories(CategoryType.GAMES);
  const { data: emulators  } = useEmulators();

  return (
    <aside className="min-w-72 flex flex-col">
      <AccordionStyled>
        <AccordionSummaryStyled>Emulador</AccordionSummaryStyled>
        <AccordionDetails>
          { emulators && emulators.map((em, i) =>
              <CheckBox key={i} 
                  className=""
                  name={ em.console } 
                  label={ em.console } />
          ) }
        </AccordionDetails>
      </AccordionStyled>
      <AccordionStyled>
        <AccordionSummaryStyled>Categorias</AccordionSummaryStyled>
        <AccordionDetails>
          { categories && categories.map((cat, i) =>
              <CheckBox key={i}
                  className=""
                  name={ cat.name }
                  label={ cat.name } />
          ) }
        </AccordionDetails>
      </AccordionStyled>
      <button className='btn-r-md bg-primary text-white gap-x-2 mt-2 self-end'>
        <IonIcon style={{color: 'white'}} icon={ filterOutline } />
        Filtrar
      </button>
    </aside>
  )
}