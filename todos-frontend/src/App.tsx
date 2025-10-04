import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ErrorBoundary } from 'react-error-boundary';

// Style
import './styles/App.scss';

// Components
import Header from './components/Header';
import TodoList from './components/TodoList';

import ThemeProvider from './contexts/ThemeProvider';

function ErrorFallback({
	error,
	resetErrorBoundary,
}: {
	error: Error;
	resetErrorBoundary: () => void;
}) {
	return (
		<div className='error-container'>
			<h2>Something went wrong</h2>
			<p>{error.message || 'Unknown error'}</p>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	);
}

const App = () => {
	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onReset={() => (window.location.href = '/')}
		>
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
