import { IonIcon } from '@ionic/react';
import { arrowForward } from 'ionicons/icons';
import useCategories, { CategoryType } from '@/hooks/useCategories.ts';

type SearchGamesSideBar = {
  onCategoryClick: (categoryName: string) => void;
}

export default function SearchGamesSideBar(props: SearchGamesSideBar) {
  const { data: categories } = useCategories(CategoryType.GAMES);

  return (
    <aside className="min-w-72 flex flex-col px-2 pt-10 pb-4 bg-layout-background">
      <h3 className="font-bold text-xl text-white">
        Todas as categorias
      </h3>
      <div className="mt-2 flex flex-col">
        {categories &&
            categories.map((cat, i) => (
                <button
                    key={i}
                    className="flex items-center gap-x-2 text-white"
                    onClick={ () => props.onCategoryClick(cat.name) }>
                  <IonIcon icon={arrowForward} />
                  {cat.name}
                </button>
            ))
        }
      </div>
    </aside>
  )
}