import {FC, memo, useCallback, useEffect, useState} from 'react';
import {useDrop} from 'react-dnd';
import {Todo} from '../model/Todo';
import {ItemTypes, FiltersTypes} from '../constants';

// Components
import AddTodo from './AddTodo';
import TodoItem from './TodoItem';
import Filters from './Filters';

// Service
import TodoService from "../services/TodoService";

// Hooks
import useWindowSize from '../hooks/useWindowSize';

const TodoList: FC = memo(() => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [_, drop] = useDrop(() => ({accept: ItemTypes.TODO}));
    const size = useWindowSize();

    const fetchTodos = async (completed?: boolean) => {
        const response = await TodoService.getTodos(completed);
        setTodos(response);
    }
    
    // Drag and Drop Functions
    const findTodo = useCallback((id: string) => {
            const todo = todos.filter(t => t.id === id)[0]
            return {todo, index: todos.indexOf(todo)};
        }, [todos]
    );

    const moveTodo = useCallback((id: string, atIndex: number) => {
            const {index} = findTodo(id);
            setTodos(prevTodos => {
                const newTodos = [...prevTodos];
                const [removed] = newTodos.splice(index, 1);
                newTodos.splice(atIndex, 0, removed);
                return newTodos;
            });
        }, [findTodo, todos, setTodos]
    );

    // Events Handlers
    const handleAddTodo = async (title: string) => {
        const todo = await TodoService.addTodo({title, isCompleted: false});
        setTodos(prevTodos => [...prevTodos, todo]);
    }

    const handleUpdateStatus = async (id: string) => {
        await TodoService.updateTodoStatus(id);
        setTodos(todos.map(
            todo => todo.id === id
                ? {...todo, isCompleted: !todo.isCompleted}
                : todo)
        );
    }

    const handleDeleteTodo = async (id: string) => {
        await TodoService.deleteTodo(id);
        setTodos(todos.filter(todo => todo.id !== id));
    }

    const handleDeleteCompletedTodos = async () => {
        await TodoService.deleteCompletedTodos();
        setTodos(todos.filter(todo => !todo.isCompleted));
    }

    const handleFilterChange = async (filter: FiltersTypes) => {
        switch (filter) {
            case FiltersTypes.ALL:
                await fetchTodos();
                break;
            case FiltersTypes.ACTIVE:
                await fetchTodos(false);
                break;
            case FiltersTypes.COMPLETED:
                await fetchTodos(true);
                break;
        }
    }

    const handleUpdateTodoIndex = async (originalIndex: number, newIndex: number) => {
        TodoService.updateTodoIndex(originalIndex, newIndex);
        await fetchTodos();
    }
    
    useEffect(() => {
        fetchTodos().catch(console.error);
    }, []);

    return (
        <>
            <AddTodo onAddTodo={handleAddTodo}/>
            <div className="todos-container">
                {todos && (
                    <>
                        <ul className="todos" ref={drop}>
                            {todos.map(todo =>
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    moveTodo={moveTodo}
                                    findTodo={findTodo}
                                    onStatusChange={handleUpdateStatus}
                                    onDeleteTodo={handleDeleteTodo}
                                    onTodoIndexChange={handleUpdateTodoIndex}
                                />
                            )}
                        </ul>
                        <div className="actions">
                            <p className="left"><span id="count">{todos.length}</span> items left</p>
                            {size.width > 800 && <Filters onFilterChange={handleFilterChange}/>}
                            <a className="clear-completed-btn" onClick={handleDeleteCompletedTodos}>
                                Clear Completed
                            </a>
                        </div>
                        
                    </>
                )}

                {!todos && (
                    <div>Loading ...</div>
                )}
                {todos && todos.length === 0 && (
                    <div className='empty-todos-container'>No todos found</div>
                )}

            </div>
            {size.width <= 800 && <Filters onFilterChange={handleFilterChange}/>}
        </>
    );
});

export default TodoList;