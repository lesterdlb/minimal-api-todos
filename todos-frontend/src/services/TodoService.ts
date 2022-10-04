import axios from 'axios';
import Todo from '../model/Todo';

const BASE_URL = 'http://localhost:11518/api/';

class TodoService {
    http = axios.create({
        baseURL: BASE_URL
    });

    async getTodos() {
        const response = await this.http.get<Todo[]>('/todos');
        return response.data;
    }

    async createTodo(todo: Todo) {
        const response = await this.http.post<Todo>('/todos', todo);
        return response.data;
    }

    async updateTodo(todo: Todo) {
        const response = await this.http.put<Todo>('/todos', todo);
        return response.data;
    }

    async deleteTodo(id: string) {
        const response = await this.http.delete<Todo>(`/todos/${id}`);
        return response.data;
    }
}

export default new TodoService();