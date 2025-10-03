import { useMemo } from 'react';
import axios from 'axios';
import { CreateTodo, Todo } from '../model/Todo';
import { SERVICE_TYPES } from '../constants/index';
import { FakeData } from '../data/FakeData';

const API_URL = import.meta.env.VITE_API_URL;
const USE_API = import.meta.env.VITE_SERVICE_TYPE === SERVICE_TYPES.Api;
const API_PREFIX = '/api/todos';
const STORAGE_KEY = 'todos';

const getLocalTodos = (): Todo[] => {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (!stored) {
		saveLocalTodos(FakeData);
		return FakeData;
	}
	return JSON.parse(stored);
};

const saveLocalTodos = (todos: Todo[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

const reorderTodoIndexes = (todos: Todo[], oldIndex: number, newIndex: number) => {
	todos
		.filter(t =>
			oldIndex < newIndex
				? t.index > oldIndex && t.index <= newIndex
				: t.index >= newIndex && t.index < oldIndex
		)
		.forEach(t => (t.index += oldIndex < newIndex ? -1 : 1));
};

const createApiService = () => {
	const http = axios.create({ baseURL: API_URL });

	http.interceptors.response.use(
		response => response,
		error => {
			const message = error.response?.data?.message || error.message || 'Petition error';
			console.error('API Error:', message);
			return Promise.reject(new Error(message));
		}
	);

	return {
		getTodos: async (completed?: boolean) => {
			const response = await http.get<Todo[]>(API_PREFIX, {
				params: { completed },
			});
			return response.data;
		},
		addTodo: async (todo: CreateTodo) => {
			const response = await http.post<Todo>(API_PREFIX, todo);
			return response.data;
		},
		updateTodoStatus: async (id: string) => {
			await http.put(`${API_PREFIX}/${id}/status`);
		},
		updateTodoIndex: async (id: string, newIndex: number) => {
			await http.put(`${API_PREFIX}/${id}/${newIndex}/index`);
		},
		deleteTodo: async (id: string) => {
			await http.delete(`${API_PREFIX}/${id}`);
		},
		deleteCompletedTodos: async () => {
			await http.delete(API_PREFIX);
		},
	};
};

const createLocalService = () => ({
	getTodos: async (completed?: boolean) => {
		const localTodos = getLocalTodos();
		const sorted = [...localTodos].sort((a, b) => a.index - b.index);
		return completed !== undefined ? sorted.filter(t => t.isCompleted === completed) : sorted;
	},
	addTodo: async (todo: CreateTodo) => {
		const localTodos = getLocalTodos();
		const newTodo: Todo = {
			id: Date.now().toString(),
			title: todo.title,
			isCompleted: todo.isCompleted,
			index: localTodos.length,
		};
		saveLocalTodos([...localTodos, newTodo]);
		return newTodo;
	},
	updateTodoStatus: async (id: string) => {
		const localTodos = getLocalTodos();
		const todo = localTodos.find(t => t.id === id);
		if (todo) {
			todo.isCompleted = !todo.isCompleted;
			saveLocalTodos(localTodos);
		}
	},
	updateTodoIndex: async (id: string, newIndex: number) => {
		const localTodos = getLocalTodos();
		const todo = localTodos.find(t => t.id === id);
		if (!todo) return;
		const oldIndex = todo.index;
		if (oldIndex === newIndex) return;

		reorderTodoIndexes(localTodos, oldIndex, newIndex);
		todo.index = newIndex;
		saveLocalTodos(localTodos);
	},
	deleteTodo: async (id: string) => {
		const localTodos = getLocalTodos();
		saveLocalTodos(localTodos.filter(t => t.id !== id));
	},
	deleteCompletedTodos: async () => {
		const localTodos = getLocalTodos();
		saveLocalTodos(localTodos.filter(t => !t.isCompleted));
	},
});

// Hook
export const useTodoService = () => {
	return useMemo(() => {
		return USE_API ? createApiService() : createLocalService();
	}, []);
};
