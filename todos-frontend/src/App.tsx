import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Style
import './styles/App.scss';

// Components
import Header from './components/Header';
import TodoList from './components/TodoList';
import ErrorBoundary from './components/ErrorBoundary';

import ThemeProvider from './contexts/ThemeProvider';

const App = () => {
	return (
		<ErrorBoundary>
			<ThemeProvider>
				<main>
					<div className='container'>
						<section className='wrapper'>
							<Header />
							<DndProvider backend={HTML5Backend}>
								<TodoList />
							</DndProvider>
							<p className='info'>Drag and drop to reorder list</p>
						</section>
					</div>
				</main>
			</ThemeProvider>
		</ErrorBoundary>
	);
};

export default App;
