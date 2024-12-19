import { MainContext, MainContextProps } from "@/apps/shared/context/MainContextProvider";
import { useContext } from "react";

type UseTailwindThemeResult = {
  config: any
  theme: any
  colors: any
}

export default function useTailwindTheme(): UseTailwindThemeResult {
  const mainContext: MainContextProps = useContext<MainContextProps>(MainContext)
  if (!mainContext)
    throw new Error('useCurrentUser must be used within an MainContextProvider');

  return {
    config: mainContext.tailwindConfig,
    theme: mainContext.tailwindConfig.theme,
    colors: mainContext.tailwindConfig.theme.colors,
  }
}