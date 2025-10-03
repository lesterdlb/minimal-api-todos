import { useContext } from 'react';
import ThemeContext from './ThemeContext';
import Sun from '../images/icon-sun.svg?react';
import Moon from '../images/icon-moon.svg?react';

const ThemeSetter = () => {
	const { theme, setTheme } = useContext(ThemeContext);

	return (
		<button
			className='btn btn-switch-theme'
			title='Switch theme'
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
		>
			{theme === 'light' ? <Moon /> : <Sun />}
		</button>
	);
};

export default ThemeSetter;
