import BaseService from './BaseService';
import { CreateTodo, Todo } from '../model/Todo';
import { FakeData } from '../data/FakeData';

class LocalTodoService implements BaseService {
	private _todoList: Todo[];

	constructor() {
		this._todoList = FakeData;
	}

	getTodos(completed?: boolean): Promise<Todo[]> {
		const todos = this._todoList.sort((a, b) => a.index - b.index);
		return completed !== undefined
			? Promise.resolve(todos.filter(todo => todo.isCompleted === completed))
			: Promise.resolve(todos);
	}

	addTodo(todo: CreateTodo): Promise<Todo> {
		const newTodo = {
			id: Date.now().toString(),
			title: todo.title,
			isCompleted: todo.isCompleted,
			index: this._todoList.length,
		};
		this._todoList = [...this._todoList, newTodo];
		return Promise.resolve(newTodo);
	}

	updateTodoStatus(id: string): void {
		this._todoList = this._todoList.map(todo =>
			todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
		);
	}

	updateTodoIndex(id: string, newIndex: number): void {
		const todo = this._todoList.find(t => t.id === id);
		if (!todo) return;

		const oldIndex = todo.index;
		if (oldIndex === newIndex) return;

		const affectedTodos =
			oldIndex < newIndex
				? this._todoList.filter(t => t.index > oldIndex && t.index <= newIndex)
				: this._todoList.filter(t => t.index >= newIndex && t.index < oldIndex);

		affectedTodos.forEach(t => {
			t.index += oldIndex < newIndex ? -1 : 1;
		});

		todo.index = newIndex;
	}

	deleteTodo(id: string): void {
		this._todoList = this._todoList.filter(todo => todo.id !== id);
	}

	deleteCompletedTodos(): void {
		this._todoList = this._todoList.filter(todo => !todo.isCompleted);
	}
}

export default new LocalTodoService();
