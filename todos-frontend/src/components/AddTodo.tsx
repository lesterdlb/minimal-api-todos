import {useState} from 'react';

interface AddTodoProps {
    onAddTodo: (title: string) => void;
}

const AddTodo = ({onAddTodo} : AddTodoProps) => {
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
                <input type='text' value={title} onChange={event => setTitle(event.target.value)}/>
                <button type='submit'>Add Todo</button>
            </form>
        </>
    );
}

export default AddTodo;