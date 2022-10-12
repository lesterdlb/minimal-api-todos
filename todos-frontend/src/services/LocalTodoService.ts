import BaseService from './BaseService';
import {CreateTodo, Todo} from '../model/Todo';
import {FakeData} from '../data/FakeData';

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
            index: this._todoList.length
        };
        this._todoList = [...this._todoList, newTodo];
        return Promise.resolve(newTodo);
    }

    updateTodoStatus(id: string): void {
        this._todoList = this._todoList.map(todo =>
            todo.id === id ? {...todo, isCompleted: !todo.isCompleted} : todo
        );
    }

    updateTodoIndex(originalIndex: number, newIndex: number): void {
        if (originalIndex > newIndex) {
            const newTodos = [...this._todoList];
            newTodos.map(todo => todo.index > newIndex - 1 && todo.index < originalIndex ? todo.index++ : todo.index);
            newTodos[originalIndex].index = newIndex;
            this._todoList = newTodos;
        }
        if (originalIndex < newIndex) {
            const newTodos = [...this._todoList];
            newTodos.map(todo => todo.index < newIndex + 1 && todo.index > originalIndex ? todo.index-- : todo);
            newTodos[originalIndex].index = newIndex;
            this._todoList = newTodos;
        }
    }

    deleteTodo(id: string): void {
        this._todoList = this._todoList.filter(todo => todo.id !== id);
    }

    deleteCompletedTodos(): void {
        this._todoList = this._todoList.filter(todo => !todo.isCompleted);
    }
}

export default new LocalTodoService();