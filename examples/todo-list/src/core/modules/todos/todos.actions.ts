import { actionNamespaceCreator } from '@yojji/core';

const createAction = actionNamespaceCreator('TODOS');

export const makeGetTodosCall = createAction('MAKE_GET_TODOS_CALL');
export const getTodos = createAction('GET_TODOS');

export const makePostTodoCall = createAction('MAKE_POST_TODO_CALL');
export const addTodo = createAction('ADD_TODO');

export const makePutTodoCall = createAction('MAKE_PUT_TODO_CALL');
export const changeTodoStatus = createAction('CHANGE_TODO_STATUS');
