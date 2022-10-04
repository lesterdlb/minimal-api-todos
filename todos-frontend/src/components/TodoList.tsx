import Todo from '../model/Todo';

interface TodoListProps {
    todos: Todo[];
    onDeleteTodo: (id: string) => void;
}

const TodoList = ({todos, onDeleteTodo}: TodoListProps) => {
    return (
        <>
            {todos && (
                <ul>
                    {todos.map(todo =>
                        <li key={todo.id}>
                            {todo.title}
                            <button onClick={() => onDeleteTodo(todo.id)}>Delete</button>
                        </li>
                    )}
                </ul>
            )}
            {!todos && (
                <div>Loading ...</div>
            )}
            {todos && todos.length === 0 && (
                <div>No todos found</div>
            )}
        </>
    )
}
export default TodoList;