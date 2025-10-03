import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Todo } from '../model/Todo';
import { ITEM_TYPES, FILTERS, FilterType } from '../constants/index';

// Components
import AddTodo from './AddTodo';
import TodoItem from './TodoItem';
import Filters from './Filters';

// Hooks
import useWindowSize from '../hooks/useWindowSize';
import { useTodoService } from '../hooks/useTodoService';

const MOBILE_BREAKPOINT = 800;

const TodoList: FC = memo(() => {
	const todoService = useTodoService();
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [, drop] = useDrop(() => ({ accept: ITEM_TYPES.TODO }));
	const size = useWindowSize();
	const [activeFilter, setActiveFilter] = useState<FilterType>(FILTERS.ALL);

	const filteredTodos = useMemo(() => {
		switch (activeFilter) {
			case FILTERS.ACTIVE:
				return todos.filter(t => !t.isCompleted);
			case FILTERS.COMPLETED:
				return todos.filter(t => t.isCompleted);
			default:
				return todos;
		}
	}, [todos, activeFilter]);

	const fetchTodos = useCallback(
		async (completed?: boolean) => {
			setLoading(true);
			setError(null);
			try {
				const response = await todoService.getTodos(completed);
				setTodos(response);
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Error loading todos';
				setError(message);
				console.error('Error fetching todos:', err);
			} finally {
				setLoading(false);
			}
		},
		[todoService]
	);

	// Drag and Drop Functions
	const findTodo = (id: string) => {
		const todo = todos.filter(t => t.id === id)[0];
		return { todo, index: todos.indexOf(todo) };
	};

	const moveTodo = (id: string, atIndex: number) => {
		const { index } = findTodo(id);
		setTodos(prevTodos => {
			const newTodos = [...prevTodos];
			const [removed] = newTodos.splice(index, 1);
			newTodos.splice(atIndex, 0, removed);
			return newTodos;
		});
	};

	// Events Handlers
	const handleAddTodo = async (title: string) => {
		try {
			const todo = await todoService.addTodo({ title, isCompleted: false });
			setTodos(prevTodos => [...prevTodos, todo]);
			setError(null);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Error adding todo';
			setError(message);
			console.error('Error adding todo:', err);
		}
	};

	const handleUpdateStatus = async (id: string) => {
		try {
			await todoService.updateTodoStatus(id);
			setTodos(prevTodos =>
				prevTodos.map(todo =>
					todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
				)
			);
			setError(null);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Error updating status';
			setError(message);
			console.error('Error updating status:', err);
		}
	};

	const handleDeleteTodo = async (id: string) => {
		try {
			await todoService.deleteTodo(id);
			setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
			setError(null);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Error deleting todo';
			setError(message);
			console.error('Error deleting todo:', err);
		}
	};

	const handleDeleteCompletedTodos = async () => {
		try {
			await todoService.deleteCompletedTodos();
			setTodos(prevTodos => prevTodos.filter(todo => !todo.isCompleted));
			setError(null);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Error deleting completed todos';
			setError(message);
			console.error('Error deleting completed:', err);
		}
	};

	const handleFilterChange = async (filter: FilterType) => {
		setActiveFilter(filter);
		// try {
		// 	switch (filter) {
		// 		case FILTERS.ALL:
		// 			await fetchTodos();
		// 			break;
		// 		case FILTERS.ACTIVE:
		// 			await fetchTodos(false);
		// 			break;
		// 		case FILTERS.COMPLETED:
		// 			await fetchTodos(true);
		// 			break;
		// 	}
		// } catch (err) {
		// 	console.error('Error filtering todos:', err);
		// }
	};

	const handleUpdateTodoIndex = async (id: string, newIndex: number) => {
		try {
			await todoService.updateTodoIndex(id, newIndex);
			await fetchTodos();
			setError(null);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Error reordering todos';
			setError(message);
			console.error('Error updating index:', err);
		}
	};

	useEffect(() => {
		fetchTodos().catch(console.error);
	}, [fetchTodos]);

	return (
		<>
			<AddTodo onAddTodo={handleAddTodo} />
			{error && (
				<div
					className='error-message'
					style={{
						padding: '10px',
						margin: '10px 0',
						backgroundColor: '#f8d7da',
						color: '#721c24',
						borderRadius: '5px',
						border: '1px solid #f5c6cb',
					}}
				>
					{error}
				</div>
			)}
			<div className='todos-container'>
				{loading && <div className='empty-todos-container'>Loading ...</div>}
				{!loading && todos.length === 0 && !error && (
					<div className='empty-todos-container'>No todos found</div>
				)}
				{!loading && todos && (
					<>
						<ul
							className='todos'
							ref={node => {
								drop(node);
							}}
						>
							{filteredTodos.map(todo => (
								<TodoItem
									key={todo.id}
									todo={todo}
									moveTodo={moveTodo}
									findTodo={findTodo}
									onStatusChange={handleUpdateStatus}
									onDeleteTodo={handleDeleteTodo}
									onTodoIndexChange={handleUpdateTodoIndex}
								/>
							))}
						</ul>
						<div className='actions'>
							<p className='left'>
								<span id='count'>{todos.length}</span> items left
							</p>
							{size.width > MOBILE_BREAKPOINT ? (
								<Filters
									activeFilter={activeFilter}
									onFilterChange={handleFilterChange}
								/>
							) : null}
							<button
								className='link clear-completed-btn'
								onClick={handleDeleteCompletedTodos}
							>
								Clear Completed
							</button>
						</div>
					</>
				)}
			</div>
			{size.width <= MOBILE_BREAKPOINT ? (
				<Filters activeFilter={activeFilter} onFilterChange={handleFilterChange} />
			) : null}
		</>
	);
});

export default TodoList;
