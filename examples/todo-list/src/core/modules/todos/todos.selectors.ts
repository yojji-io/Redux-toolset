import { createSelector } from 'reselect';

import { TStore } from '../../root-reducer';

const selectTodos = (state: TStore) => state.todos;

export const selectIsLoading = createSelector(selectTodos, state => state.isLoading);
export const selectTodosList = createSelector(selectTodos, state => [...state.list].reverse());
export const selectTodoById = createSelector(selectTodosList, todoList => (todoIdToFind: number) =>
    todoList.find(({ id }) => id === todoIdToFind));
