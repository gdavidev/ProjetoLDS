import EmulatorApiService from "@/api/EmulatorApiService";
import CheckBox from "@apps/shared/components/formComponents/CheckBox";
import Emulator from "@models/Emulator";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Checkbox } from "@mui/joy";
import { useEffect, useState } from "react";

export default function SearchGamesSideBar() {
  const [ emulatorList, setEmulatorList ] = useState<Emulator[]>([]);

  useEffect(() => {
    fetchEmulatorData();
  }, [])

  function fetchEmulatorData() {
    EmulatorApiService.getAll()
      .then(data => {        
        data.sort((prev: Emulator, curr: Emulator) => prev.id - curr.id)
        setEmulatorList(data);
      });
  }

  return (
    <aside className="min-w-56 ps-6 pe-3">
      <AccordionGroup transition="0.2s ease" variant="plain" disableDivider>
        <Accordion>
          <AccordionSummary>Emulador</AccordionSummary>
          <AccordionDetails>
            { emulatorList.map((em, i) => 
                <CheckBox key={i} 
                    className=""
                    name={ em.console } 
                    label={ em.console } />
            ) }
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>Title</AccordionSummary>
          <AccordionDetails>
            <Checkbox />
            <Checkbox />
            <Checkbox />
          </AccordionDetails>
        </Accordion>
      </AccordionGroup>
    </aside>
  )
}