import axios from 'axios';

import { ITodo } from '../core/modules/todos/todos.reducer';

const api = axios.create({
    baseURL: 'http://192.168.1.125:3004',
});

export const getTodos = () => api.get('posts/');

export const postTodo = (todo: ITodo) => api.post('posts/', todo);

export const putTodo = (todo: ITodo) => api.put(`posts/${todo.id}`, todo);
