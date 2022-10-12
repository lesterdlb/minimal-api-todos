import {useRef} from 'react';

interface AddTodoProps {
    onAddTodo: (title: string) => void;
}

const AddTodo = ({onAddTodo}: AddTodoProps) => {
    const titleInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!titleInputRef.current?.value) return;
        onAddTodo(titleInputRef.current?.value);
        titleInputRef.current.value = '';
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
                       ref={titleInputRef}/>
                <button type='submit' className="btn add-todo">+</button>
            </form>
        </>
    );
}

export default AddTodo;