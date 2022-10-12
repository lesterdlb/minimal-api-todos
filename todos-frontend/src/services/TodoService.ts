import BaseService from './BaseService';
import LocalTodoService from './LocalTodoService';
import ApiTodoService from './ApiTodoService';
import {CreateTodo, Todo} from '../model/Todo';
import {ServiceTypes} from '../constants';

class TodoService implements BaseService {
    private service: BaseService;

    constructor(serviceType: string) {
        if (serviceType === ServiceTypes.Api) {
            this.service = ApiTodoService;
        } else {
            this.service = LocalTodoService;
        }
    }

    getTodos(completed?: boolean): Promise<Todo[]> {
        return this.service.getTodos(completed);
    }

    addTodo(todo: CreateTodo): Promise<Todo> {
        return this.service.addTodo(todo);
    }

    updateTodoStatus(id: string): void {
        this.service.updateTodoStatus(id);
    }

    updateTodoIndex(originalIndex: number, newIndex: number): void {
        this.service.updateTodoIndex(originalIndex, newIndex);
    }

    deleteTodo(id: string): void {
        this.service.deleteTodo(id);
    }

    deleteCompletedTodos(): void {
        this.service.deleteCompletedTodos();
    }
}

export default new TodoService(process.env.REACT_APP_SERVICE_TYPE || ServiceTypes.Local);