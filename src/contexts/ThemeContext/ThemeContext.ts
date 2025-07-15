import { createContext } from "react";
import { Theme } from "./ThemeContext.types";

type ContextType = {
    theme: Theme,
    setTheme: (newTheme: Theme) => void,
};

const defaultContext: ContextType = {
    theme: 'light',
    setTheme: () => {
        throw new Error("Not implemented.")
    },
};

export const ThemeContext = createContext(defaultContext);