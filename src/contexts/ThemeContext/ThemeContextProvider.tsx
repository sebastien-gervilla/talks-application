import { ReactNode, useEffect, useState } from "react";
import { Theme } from "./ThemeContext.types";
import { ThemeContext } from "./ThemeContext";
import { Storage } from "@/helpers/storage";

interface Props {
    children: ReactNode;
}

export const ThemeContextProvider = ({ children }: Props) => {

    const [theme, setTheme] = useState<Theme>(() => {
        const theme = Storage.get('theme');
        return (theme !== 'light' && theme !== 'dark')
            ? 'light'
            : theme;
    });

    useEffect(() => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
        Storage.set('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme,
        }}>
            {children}
        </ThemeContext.Provider>
    );
};