import axios from 'axios';
import {CreateTodo, Todo} from '../model/Todo';
import BaseService from './BaseService';

class ApiTodoService implements BaseService {
    http = axios.create({
        baseURL: process.env.REACT_APP_API_URL
    });

    async getTodos() {
        const response = await this.http.get<Todo[]>('/todos');
        return response.data;
    }

    async addTodo(todo: CreateTodo) {
        const response = await this.http.post<Todo>('/todos', todo);
        return response.data;
    }

    async updateTodoStatus(id: string) {
        const response = await this.http.put<Todo>('/todos', {id});
        return response.data;
    }

    updateTodoIndex(originalIndex: number, newIndex: number): void {
        console.log('updateTodoIndex', originalIndex, newIndex);
        throw new Error('Method not implemented.');
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