import {useContext} from "react";
import ThemeContext from "./ThemeContext";
import {ReactComponent as Sun} from '../images/icon-sun.svg';
import {ReactComponent as Moon} from '../images/icon-moon.svg';

const ThemeSetter = () => {
    const {theme, setTheme} = useContext(ThemeContext);

    return (
        <button
            className='btn btn-switch-theme'
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <Moon/> : <Sun/>}
        </button>
    )
}

export default ThemeSetter;