import axios from 'axios';
import {CreateTodo, Todo} from '../model/Todo';
import BaseService from './BaseService';

class ApiTodoService implements BaseService {
    http = axios.create({
        baseURL: import.meta.env.VITE_API_URL
    });

    async getTodos(completed?: boolean) {
        const response = await this.http.get<Todo[]>('/todos', {params: {completed}});
        return response.data;
    }

    async addTodo(todo: CreateTodo) {
        const response = await this.http.post<Todo>('/todos', todo);
        return response.data;
    }

    async updateTodoStatus(id: string) {
        const response = await this.http.put<Todo>(`/todos/${id}/status`);
        return response.data;
    }

    async updateTodoIndex(originalIndex: number, newIndex: number): Promise<void> {
        await this.http.put<Todo>(`/todos/${originalIndex}/${newIndex}/index`);
    }

    async deleteTodo(id: string) {
        const response = await this.http.delete<Todo>(`/todos/${id}`);
        return response.data;
    }

    async deleteCompletedTodos() {
        const response = await this.http.delete<Todo>('/todos');
        return response.data;
    }
}

export default new ApiTodoService();