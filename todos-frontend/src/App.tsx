import {useEffect, useState} from 'react';
import './App.css';
import TodoService from "./services/TodoService";
import Todo from "./model/Todo";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";

const App = () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    const handleAddTodo = async (title: string) => {
        const response = await TodoService.createTodo({
            id: '', title, isCompleted: false
        });
        setTodos([...todos, response]);
    }
    
    const handleDeleteTodo = async (id: string) => {
        await TodoService.deleteTodo(id);
        setTodos(todos.filter(todo => todo.id !== id));
    }

    const fetchTodos = async () => {
        const response = await TodoService.getTodos();
        setTodos(response);
    }

    useEffect(() => {
        fetchTodos().catch(console.error);
    }, []);

    return (
        <div className="App">
            <h1>Todos</h1>
            <AddTodo onAddTodo={handleAddTodo}/>
            <TodoList todos={todos} onDeleteTodo={handleDeleteTodo}/>
        </div>
    );
}

export default App;
