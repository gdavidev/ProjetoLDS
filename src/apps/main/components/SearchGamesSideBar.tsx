import CheckBox from '@shared/components/formComponents/CheckBox.tsx';
import { AccordionDetails } from '@mui/material';
import { IonIcon } from '@ionic/react';
import { filterOutline } from 'ionicons/icons';
import useCategories, { CategoryType } from '@/hooks/useCategories.ts';
import useEmulators from '@/hooks/useEmulators.ts';
import { AccordionStyled, AccordionSummaryStyled } from '@shared/components/MuiStyled/Accordion.tsx';

export default function SearchGamesSideBar() {
  const { data: categories } = useCategories(CategoryType.GAMES);
  const { data: emulators  } = useEmulators();

  return (
    <aside className="min-w-72 flex flex-col px-2 pt-10 pb-4 bg-layout-background">
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