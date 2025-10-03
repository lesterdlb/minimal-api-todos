import { useRef } from 'react';

interface AddTodoProps {
	onAddTodo: (title: string) => void;
}

const AddTodo = ({ onAddTodo }: AddTodoProps) => {
	const titleInputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const value = titleInputRef.current?.value.trim();

		if (!value) {
			alert('Please enter a title for the todo');
			return;
		}

		if (value.length < 3) {
			alert('Title must be at least 3 characters long');
			return;
		}

		onAddTodo(value);
		if (titleInputRef.current) {
			titleInputRef.current.value = '';
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type='text'
				id='todo-input'
				placeholder='Create a new todo...'
				className='todo-input'
				autoComplete='off'
				ref={titleInputRef}
				required
				minLength={3}
				aria-label='New todo'
			/>
			<button
				type='submit'
				title='Add Todo'
				className='btn add-todo'
				aria-label='Add todo'
			>
				+
			</button>
		</form>
	);
};

export default AddTodo;
