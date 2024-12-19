import { AccordionProps } from '@mui/material/Accordion';
import { Accordion, AccordionSummary } from '@mui/material';
import { accordionSummaryClasses, AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { IonIcon } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';

export const AccordionStyled = (props: AccordionProps) => (
		<Accordion {...props}
			 disableGutters
			 sx={{
				 backgroundColor: 'transparent',
				 border: 'none',
				 color: 'white',
				 boxShadow: 'none',
			 }} />
);
export const AccordionSummaryStyled = (props: AccordionSummaryProps) => (
		<AccordionSummary {...props}
				expandIcon={<IonIcon style={{ color: 'white' }} icon={chevronForwardOutline} />}
				sx={{
					display: 'flex',
					flexDirection: 'row-reverse',
					columnGap: '0.5rem',
					[`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
						transform: 'rotate(90deg)',
					},
				}} />
);