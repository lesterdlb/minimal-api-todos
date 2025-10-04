import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Todo } from '../model/Todo';
import { ITEM_TYPES, FILTERS, FilterType } from '../constants/index';

// Components
import AddTodo from './AddTodo';
import TodoItem from './TodoItem';
import Filters from './Filters';

// Hooks
import { useTodoService } from '../hooks/useTodoService';

const TodoList: FC = memo(() => {
	const todoService = useTodoService();
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [, drop] = useDrop(() => ({ accept: ITEM_TYPES.TODO }));
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
	const moveTodo = (dragIndex: number, hoverIndex: number) => {
		setTodos(prevTodos => {
			const newTodos = [...prevTodos];
			const [removed] = newTodos.splice(dragIndex, 1);
			newTodos.splice(hoverIndex, 0, removed);
			return newTodos;
		});
	};

	// Events Handlers
	const handleAddTodo = async (title: string) => {
		const tempId = `temp-${Date.now()}`;
		const tempTodo: Todo = {
			id: tempId,
			title,
			isCompleted: false,
			index: todos.length,
		};

		setTodos(prevTodos => [...prevTodos, tempTodo]);

		try {
			const savedTodo = await todoService.addTodo({ title, isCompleted: false });
			setTodos(prevTodos => prevTodos.map(todo => (todo.id === tempId ? savedTodo : todo)));
			setError(null);
		} catch (err) {
			setTodos(prevTodos => prevTodos.filter(todo => todo.id !== tempId));
			const message = err instanceof Error ? err.message : 'Error adding todo';
			setError(message);
			console.error('Error adding todo:', err);
		}
	};

	const handleUpdateStatus = async (id: string) => {
		const previousTodos = todos;

		setTodos(prevTodos =>
			prevTodos.map(todo =>
				todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
			)
		);

		try {
			await todoService.updateTodoStatus(id);
			setError(null);
		} catch (err) {
			setTodos(previousTodos);
			const message = err instanceof Error ? err.message : 'Error updating status';
			setError(message);
			console.error('Error updating status:', err);
		}
	};

	const handleDeleteTodo = async (id: string) => {
		const previousTodos = todos;

		setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

		try {
			await todoService.deleteTodo(id);
			setError(null);
		} catch (err) {
			setTodos(previousTodos);
			const message = err instanceof Error ? err.message : 'Error deleting todo';
			setError(message);
			console.error('Error deleting todo:', err);
		}
	};

	const handleDeleteCompletedTodos = async () => {
		const previousTodos = todos;

		setTodos(prevTodos => prevTodos.filter(todo => !todo.isCompleted));

		try {
			await todoService.deleteCompletedTodos();
			setError(null);
		} catch (err) {
			setTodos(previousTodos);
			const message = err instanceof Error ? err.message : 'Error deleting completed todos';
			setError(message);
			console.error('Error deleting completed todos:', err);
		}
	};

	const handleFilterChange = async (filter: FilterType) => {
		setActiveFilter(filter);
	};

	const handleDrop = async (id: string, newIndex: number) => {
		const previousTodos = todos;

		try {
			await todoService.updateTodoIndex(id, newIndex);
			setError(null);
		} catch (err) {
			setTodos(previousTodos);
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
				{loading && (
					<div className='loading-overlay'>
						<span>Loading...</span>
					</div>
				)}

				{todos.length === 0 && !loading && !error && (
					<div className='empty-todos-container'>No todos found</div>
				)}

				{todos.length > 0 && (
					<>
						<ul
							className='todos'
							ref={node => {
								drop(node);
							}}
						>
							{filteredTodos.map((todo, index) => (
								<TodoItem
									key={todo.id}
									todo={todo}
									index={index}
									onMove={moveTodo}
									onDrop={handleDrop}
									onStatusChange={handleUpdateStatus}
									onDeleteTodo={handleDeleteTodo}
								/>
							))}
						</ul>
						<div className='actions'>
							<p className='left'>
								<span id='count'>{todos.length}</span> items left
							</p>
							<Filters
								activeFilter={activeFilter}
								onFilterChange={handleFilterChange}
								className='filters-desktop'
							/>
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
			<Filters
				activeFilter={activeFilter}
				onFilterChange={handleFilterChange}
				className='filters-mobile'
			/>
		</>
	);
});

export default TodoList;
