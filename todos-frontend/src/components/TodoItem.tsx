import { FC, memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Cross from '../images/icon-cross.svg?react';
import { Todo } from '../model/Todo';
import { ItemTypes } from '../constants';

export interface TodoItemProps {
	todo: Todo;
	moveTodo: (id: string, to: number) => void;
	findTodo: (id: string) => { index: number };
	onStatusChange: (id: string) => void;
	onDeleteTodo: (id: string) => void;
	onTodoIndexChange: (id: string, newIndex: number) => void;
}

interface Item {
	todo: Todo;
	originalIndex: number;
}

const TodoItem: FC<TodoItemProps> = memo(
	({ todo, moveTodo, findTodo, onStatusChange, onDeleteTodo, onTodoIndexChange }) => {
		const originalIndex = findTodo(todo.id).index;

		const [{ isDragging }, drag] = useDrag(
			() => ({
				type: ItemTypes.TODO,
				item: { todo, originalIndex },
				collect: monitor => ({
					isDragging: monitor.isDragging(),
				}),
				end: (item, monitor) => {
					const { todo: droppedTodo, originalIndex } = item;
					const didDrop = monitor.didDrop();
					if (!didDrop) {
						moveTodo(droppedTodo.id, originalIndex);
					}
				},
			}),
			[todo, originalIndex, moveTodo]
		);

		const [, drop] = useDrop(
			() => ({
				accept: ItemTypes.TODO,
				hover: ({ todo: draggedTodo }: Item) => {
					if (draggedTodo.id !== todo.id) {
						const { index: overIndex } = findTodo(todo.id);
						moveTodo(draggedTodo.id, overIndex);
					}
				},
				drop: (item: Item) => {
					const { index: overIndex } = findTodo(todo.id);
					if (item.originalIndex === overIndex) {
						return;
					}
					onTodoIndexChange(item.todo.id, overIndex);
				},
			}),
			[findTodo, moveTodo]
		);
		const opacity = isDragging ? 0 : 1;

		return (
			<li
				ref={node => {
					drag(drop(node));
				}}
				className='todo-item'
				style={{ opacity }}
			>
				<label className='checkbox-label'>
					<input
						type='checkbox'
						title={`Mark as ${todo.isCompleted ? 'incomplete' : 'complete'}`}
						aria-label={`Mark "${todo.title}" as ${todo.isCompleted ? 'incomplete' : 'complete'}`}
						checked={todo.isCompleted}
						onChange={() => onStatusChange(todo.id)}
					/>
					<span className='checkbox-round' />
				</label>
				<div className={`todo ${todo.isCompleted ? 'completed' : ''}`}>{todo.title}</div>
				<button
					className='btn'
					title={`Delete "${todo.title}"`}
					aria-label={`Delete "${todo.title}"`}
					onClick={() => onDeleteTodo(todo.id)}
				>
					<Cross />
				</button>
			</li>
		);
	}
);

export default TodoItem;
