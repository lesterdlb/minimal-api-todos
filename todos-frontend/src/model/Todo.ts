export interface Todo {
	id: string;
	title: string;
	isCompleted: boolean;
	index: number;
}

export type CreateTodo = Pick<Todo, 'title' | 'isCompleted'>;
