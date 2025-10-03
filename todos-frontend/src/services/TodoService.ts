import BaseService from './BaseService';
import LocalTodoService from './LocalTodoService';
import ApiTodoService from './ApiTodoService';
import { CreateTodo, Todo } from '../model/Todo';
import { ServiceTypes } from '../constants';

class TodoService implements BaseService {
	private service: BaseService;

	constructor(serviceType: string) {
		this.service = serviceType === ServiceTypes.Api ? ApiTodoService : LocalTodoService;
	}

	async getTodos(completed?: boolean): Promise<Todo[]> {
		return await this.service.getTodos(completed);
	}

	async addTodo(todo: CreateTodo): Promise<Todo> {
		return await this.service.addTodo(todo);
	}

	async updateTodoStatus(id: string): Promise<void> {
		await this.service.updateTodoStatus(id);
	}

	async updateTodoIndex(id: string, newIndex: number): Promise<void> {
		await this.service.updateTodoIndex(id, newIndex);
	}

	async deleteTodo(id: string): Promise<void> {
		await this.service.deleteTodo(id);
	}

	async deleteCompletedTodos(): Promise<void> {
		await this.service.deleteCompletedTodos();
	}
}

export default new TodoService(import.meta.env.VITE_SERVICE_TYPE || ServiceTypes.Local);
