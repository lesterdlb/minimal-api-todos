import Todo from '../model/Todo';
import {ReactComponent as Check} from '../images/icon-check.svg';

interface TodoListProps {
    todos: Todo[];
    onDeleteTodo: (id: string) => void;
}

const TodoList = ({todos, onDeleteTodo}: TodoListProps) => {
    return (
        <>
            <div className="todos-container">
                {todos && (
                    <>
                        <ul className="todos">
                            {todos.map(todo =>
                                <div key={todo.id} className='todo-item'>
                                    <label className="checkbox-label">
                                        <input type="checkbox"/>
                                        <span className="checkbox-round"/>
                                    </label>
                                    <li className="todo">{todo.title}</li>
                                    <button className="btn delete" onClick={() => onDeleteTodo(todo.id)}>
                                        <Check/>
                                    </button>
                                </div>
                            )}
                        </ul>
                        <div className="actions">
                            <p className="left"><span id="count">{todos.length}</span> items left</p>
                            <a href="#" className="clear-completed-btn">Clear Completed</a>
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
        </>
    )
}
export default TodoList;