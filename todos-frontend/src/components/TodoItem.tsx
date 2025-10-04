import { FC, memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Cross from '../images/icon-cross.svg?react';
import { Todo } from '../model/Todo';
import { ITEM_TYPES } from '../constants/index';

export interface TodoItemProps {
	todo: Todo;
	index: number;
	onMove: (dragIndex: number, hoverIndex: number) => void;
	onDrop: (id: string, newIndex: number) => void;
	onStatusChange: (id: string) => void;
	onDeleteTodo: (id: string) => void;
}

interface DragItem {
	id: string;
	index: number;
}

const TodoItem: FC<TodoItemProps> = memo(
	({ todo, index, onMove, onDrop, onStatusChange, onDeleteTodo }) => {
		const [{ isDragging }, drag] = useDrag(
			() => ({
				type: ITEM_TYPES.TODO,
				item: { id: todo.id, index },
				collect: monitor => ({
					isDragging: monitor.isDragging(),
				}),
			}),
			[todo.id, index]
		);

		const [, drop] = useDrop(
			() => ({
				accept: ITEM_TYPES.TODO,
				hover: (item: DragItem) => {
					if (item.index !== index) {
						onMove(item.index, index);
						item.index = index;
					}
				},
				drop: (item: DragItem) => {
					onDrop(item.id, index);
				},
			}),
			[index, onMove, onDrop]
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
						aria-label={`Mark "${todo.title}" as ${
							todo.isCompleted ? 'incomplete' : 'complete'
						}`}
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
