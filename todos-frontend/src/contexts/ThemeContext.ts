import {createContext} from "react";

interface ThemeState {
    theme: string;
    setTheme: (theme: string) => void;
}

export const initialThemeState: ThemeState = {
    theme: "dark",
    setTheme: () => {}
};

const ThemeContext = createContext<ThemeState>(initialThemeState);
export default ThemeContext;