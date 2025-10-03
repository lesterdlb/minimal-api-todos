import { useState, useEffect, JSX } from 'react';
import ThemeContext, { initialThemeState } from './ThemeContext';

interface ThemeProviderProps {
	children: JSX.Element;
}

const LOCAL_STORAGE_KEY = 'todoAppTheme';

const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const [theme, setTheme] = useState('');

	useEffect(() => {
		const savedThemeLocal = window.localStorage.getItem(LOCAL_STORAGE_KEY);
		setTheme(savedThemeLocal || initialThemeState.theme);
	}, []);

	useEffect(() => {
		if (theme) {
			window.localStorage.setItem(LOCAL_STORAGE_KEY, theme);
		}
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<div className={`theme--${theme}`}>{children}</div>
		</ThemeContext.Provider>
	);
};

export default ThemeProvider;
