# EmuHub - Community

## Links

- **Trello:** https://trello.com/invite/projetolds/ATTI7743c990b9533cadb4a3b3407ae5445a1943E786
- **Figma:** https://www.figma.com/design/K023TZbMqdnZbY4A0TCK3q/PROJETO---X?node-id=859-2&node-type=FRAME&t=NDzRitfY6qtH1ctQ-0

## A Stack

- **Front:**
  - Main Tech: Typescript on React with Vite and Tailwind;
  - Component Libraries: SwiperJS and MUI Components (Joy UI version).
  - Tool Libraries: ReactQuery and Axios for HTTP Requests handling and js-cookie.
  - Testing: Jest and react-testing-library.
- **Back API:** Python (Django)
- **Back API Client:** Delphi
- **Database:** PostgreSQL

OK api/ roms/ [name='rom-list']
api/ roms/detail/ [name='rom-detail']
api/ roms/search/ [name='rom-search']
api/ roms/mostplayed/ [name='rom-mostplayed']
api/ roms/<str:empresa>/<str:emulador_name>/<str:game_name>/download/ [name='rom-download']
api/ roms/update/ [name='rom-update']
api/ roms/delete/ [name='rom-delete']
api/ roms/create/ [name='rom-create']
api/ users/ [name='user-list']
api/ users/detail/ [name='user-detail']
api/ users/update/ [name='user-update']
api/ users/delete/ [name='user-delete']
api/ register/ [name='user-create']
api/ users/wishlist/ [name='user-wishlist']
api/ users/wishlist/add/ [name='user-add-wishlist']
api/ users/wishlist/remove/ [name='user-remove-wishlist']
api/ token/refresh/ [name='token-refresh']
api/ token/ [name='token']
api/ forgot-password/ [name='forgot-password']
api/ reset-password/ [name='reset-password']
api/ protected/ [name='protected']
api/ emuladores/ [name='emuladores']
api/ emulador/create/ [name='emulador-create']
api/ emulador/update/ [name='emulador-update']
api/ emulador/delete/ [name='emulador-delete']
api/ emulador/<str:emulador_name>/download/ [name='emulador-download']
api/ categorias/ [name='categorias']
