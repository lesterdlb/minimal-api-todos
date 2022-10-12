import {useState, useEffect} from "react";
import ThemeContext, {initialThemeState} from "./ThemeContext";

interface ThemeProviderProps {
    children: JSX.Element,
}

const LOCAL_STORAGE_KEY = "todoAppTheme";

const ThemeProvider = ({children}: ThemeProviderProps) => {
    const [theme, setTheme] = useState('');
    const localStorage = window.localStorage;

    useEffect(() => {
        const savedThemeLocal = localStorage.getItem(LOCAL_STORAGE_KEY);

        !!savedThemeLocal ? setTheme(savedThemeLocal) : setTheme(initialThemeState.theme);
    }, [localStorage]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, theme);
    }, [theme, localStorage]);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <div className={`theme--${theme}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;