import axios from 'axios';
import { CreateTodo, Todo } from '../model/Todo';
import BaseService from './BaseService';

class ApiTodoService implements BaseService {
	http = axios.create({
		baseURL: import.meta.env.VITE_API_URL,
	});

	constructor() {
		this.http.interceptors.response.use(
			response => response,
			error => {
				const message =
					error.response?.data?.message || error.message || 'Error en la petición';
				console.error('API Error:', message);
				return Promise.reject(new Error(message));
			}
		);
	}

	async getTodos(completed?: boolean) {
		const response = await this.http.get<Todo[]>('/api/todos', { params: { completed } });
		return response.data;
	}

	async addTodo(todo: CreateTodo) {
		const response = await this.http.post<Todo>('/api/todos', todo);
		return response.data;
	}

	async updateTodoStatus(id: string) {
		const response = await this.http.put<Todo>(`/api/todos/${id}/status`);
		return response.data;
	}

	async updateTodoIndex(id: string, newIndex: number): Promise<void> {
		await this.http.put<Todo>(`/api/todos/${id}/${newIndex}/index`);
	}

	async deleteTodo(id: string) {
		const response = await this.http.delete<Todo>(`/api/todos/${id}`);
		return response.data;
	}

	async deleteCompletedTodos() {
		const response = await this.http.delete<Todo>('/api/todos');
		return response.data;
	}
}

export default new ApiTodoService();
