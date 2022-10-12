export interface CreateTodo {
    title: string;
    isCompleted: boolean;
}

export interface Todo {
    id: string;
    title: string;
    isCompleted: boolean;
    index: number;
}