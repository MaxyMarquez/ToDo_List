import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { MdOutlineDelete, MdOutlineDoneAll, MdOutlineRemoveDone, MdFormatListBulletedAdd, MdOutlineModeEdit, MdOutlineSaveAlt } from 'react-icons/md';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [edit, setEdit] = useState('');
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [theme, setTheme] = useState('light');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newTodo.trim()) {
            const todo = { id: Date.now(), text: newTodo, completed: false };
            setTodos([...todos, todo]);
            localStorage.setItem('todos', JSON.stringify([...todos, todo]));
            setNewTodo('');
        }
    };

    const handleDone = (id) => {
        setTodos((prevTodos) => {
            const updatedTodos = prevTodos.map((todo) => {
                if (todo.id === id) {
                    return { ...todo, completed: !todo.completed };
                }
                return todo;
            });
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
            return updatedTodos;
        });
    };

    const handleEdit = (id) => {
        setEditingTodoId(id);
        const todoToEdit = todos.find((todo) => todo.id === id);
        setEdit(todoToEdit.text);
    };

    const handleSave = (id) => {
        setTodos((prevTodos) => {
            const updatedTodos = prevTodos.map((todo) => {
                if (todo.id === id) {
                    return { ...todo, text: edit };
                }
                return todo;
            });
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
            return updatedTodos;
        });
        setEditingTodoId(null);
    };

    const handleDelete = (id) => {
        setTodos((prevTodos) => {
            const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
            return updatedTodos;
        });
    };

    const handleClear = () => {
        localStorage.clear();
        setTodos([]);
    };

    const [filterType, setFilterType] = useState('all');

    const handleShowAll = () => {
        setFilterType('all');
    };

    const handleShowPending = () => {
        setFilterType('pending');
    };

    const handleShowCompleted = () => {
        setFilterType('completed');
    };

    const handleChangeTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }

    useEffect(() => {
        if (theme === 'dark') {
            document.querySelector('html').classList.add('dark')
        } else {
            document.querySelector('html').classList.remove('dark')
        }

        const storedTodo = localStorage.getItem('todos');
        if (storedTodo) {
            setTodos(JSON.parse(storedTodo));
        }
    }, [theme]);

    return (
        <>
            <div className=' flex w-full min-h-screen flex-col justify-start items-center p-5 bg-slate-200 dark:bg-slate-800 gap-2 '>
                <div className='flex justify-between w-full py-2'>
                    <h1 className='dark:text-slate-200 text-slate-400 text-3xl'>TODO List</h1>
                    {
                        theme === 'light'
                            ? <button onClick={handleChangeTheme}><Icon icon="ph:moon" className='w-6 h-6 text-slate-500' /></button>
                            : <button onClick={handleChangeTheme}><Icon icon="ph:sun" className='w-6 h-6 dark:text-slate-200' /></button>
                    }
                </div>
                <form className='flex bg-white items-center w-full' onSubmit={handleSubmit}>
                    <button className=' bg-white mx-2' type='submit' onClick={handleSubmit}>
                        <MdFormatListBulletedAdd className='w-8 h-8 text-slate-400' />
                    </button>
                    <input
                        className='p-3 focus:outline-none w-full '
                        type='text'
                        placeholder='Add Something...'
                        value={newTodo}
                        onChange={(event) => setNewTodo(event.target.value)}
                    />
                </form>
                <div className='flex gap-2 justify-between w-full mt-4'>
                    <div className='flex'>
                        <button className={`${filterType === 'all' ? 'text-slate-200 bg-blue-500' : 'text-slate-400 border-transparent '} px-4 duration-300`} onClick={handleShowAll}>All</button>
                        <button className={`${filterType === 'pending' ? 'text-slate-200 bg-blue-500' : 'text-slate-400 border-transparent '} px-4 duration-300`} onClick={handleShowPending}>Pending</button>
                        <button className={`${filterType === 'completed' ? 'text-slate-200 bg-blue-500' : 'text-slate-400 border-transparent '} px-4 duration-300`} onClick={handleShowCompleted}>Completed</button>
                    </div>
                    <div>
                        <button className='bg-blue-500 py-2 px-4 hover:bg-blue-400 duration-300 text-slate-200' onClick={handleClear}>Clear</button>
                    </div>
                </div>
                <div className='w-full lg:w-[600px] pt-2'>
                    {
                        todos
                            .filter(todo => {
                                if (filterType === 'pending') {
                                    return !todo.completed;
                                } else if (filterType === 'completed') {
                                    return todo.completed;
                                }
                                return true;
                            })
                            .map((todo) => (
                                <div key={todo.id} className={`flex justify-between items-center gap-3 w-full p-3 mb-1 duration-300 ${todo.completed ? 'bg-green-500 text-slate-200' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                    <input
                                        className={`${editingTodoId !== todo.id ? 'bg-transparent' : 'p-2 bg-slate-300 text-slate-200'} text-base dark:text-slate-200 focus:outline-none w-full ${todo.completed ? 'line-through decoration-1' : ''}`}
                                        value={editingTodoId === todo.id ? edit : todo.text}
                                        onChange={(event) => setEdit(event.target.value)}
                                        disabled={editingTodoId !== todo.id}
                                    />

                                    <div className='flex gap-5'>
                                        <button className='group flex items-center p-0 lg:p-2 hover:rounded-full hover:bg-[#ffffff80] duration-300' onClick={() => handleDone(todo.id)}>
                                            {todo.completed
                                                ? <MdOutlineDoneAll className='group-hover:scale-105 w-4 h-4 lg:w-6 lg:h-6 text-slate-200 duration-100' />
                                                : <Icon icon="ic:outline-pending-actions" className=' group-hover:scale-105 w-4 h-4 lg:w-6 lg:h-6 text-slate-700 dark:text-slate-200 duration-100' />}
                                        </button>
                                        {editingTodoId === todo.id ? (
                                            <>
                                                <button className='group flex p-0 lg:p-2 hover:bg-[#ffffff80] hover:rounded-full duration-300' onClick={() => handleSave(todo.id)}>
                                                    <MdOutlineSaveAlt className='group-hover:scale-105 w-4 h-4 lg:w-6 lg:h-6 text-slate-700 dark:text-slate-200 duration-100' />
                                                </button>
                                            </>
                                        ) : (
                                            <button className='group flex p-0 lg:p-2 hover:bg-[#ffffff80] hover:rounded-full duration-300' onClick={() => handleEdit(todo.id)}>
                                                <MdOutlineModeEdit className={`group-hover:scale-105 w-4 h-4 lg:w-6 lg:h-6 ${todo.completed ? 'text-slate-200' : 'text-slate-700 dark:text-slate-200'} duration-100`} />
                                            </button>
                                        )}
                                        <button className='group flex p-0 lg:p-2 hover:bg-[#ffffff80] hover:rounded-full duration-300' onClick={() => handleDelete(todo.id)}>
                                            <MdOutlineDelete className={`group-hover:scale-105 w-4 h-4 lg:w-6 lg:h-6  duration-100 ${todo.completed ? 'text-slate-200' : 'text-slate-700 dark:text-slate-200'}`} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                </div>
            </div>
        </>
    );
};

export default TodoList;

