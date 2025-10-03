import { CreateTodo, Todo } from '../model/Todo';

export default interface BaseService {
	getTodos(completed?: boolean): Promise<Todo[]>;
	addTodo(todo: CreateTodo): Promise<Todo>;
	updateTodoStatus(id: string): void;
	updateTodoIndex(id: string, newIndex: number): void;
	deleteTodo(id: string): void;
	deleteCompletedTodos(): void;
}
