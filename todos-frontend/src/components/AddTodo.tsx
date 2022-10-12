import {useState} from 'react';

interface AddTodoProps {
    onAddTodo: (title: string) => void;
}

const AddTodo = ({onAddTodo}: AddTodoProps) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!title) return;
        onAddTodo(title);
        setTitle('');
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label className="checkbox-label">
                    <input type="checkbox"/>
                    <span className="checkbox-round"/>
                </label>
                <input type="text" id="todo-input" placeholder="Create a new todo..."
                       className='todo-input' autoComplete='off'
                       value={title} onChange={event => setTitle(event.target.value)}/>
                <button type='submit' className="btn add-todo">+</button>
            </form>
        </>
    );
}

export default AddTodo;