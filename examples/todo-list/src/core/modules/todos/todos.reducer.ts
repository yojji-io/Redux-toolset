import {
    createReducer,
    compose,
} from '@yojji/core';

import * as actions from './todos.actions';

export interface ITodo {
    id: number;
    text: string;
    complete: boolean;
}

export interface IInitialState {
    list: ITodo[];
    isLoading: boolean;
}

const initialState: IInitialState = {
    list: [],
    isLoading: false,
};

const getTodosReducer = createReducer<IInitialState>(actions.makeGetTodosCall, s => ({
    [s.DEFAULT]: state => ({ ...state, isLoading: true }),
    [s.SUCCESS]: (state, { payload }) => ({ ...state, list: payload.data, isLoading: false }),
    [s.FAILURE]: state => ({ ...state, isLoading: false }),
}), initialState);

const postTodoReducer = createReducer<IInitialState>(actions.makePostTodoCall, s => ({
    [s.DEFAULT]: state => ({ ...state, isLoading: true }),
    [s.SUCCESS]: state => ({ ...state, isLoading: false}),
    [s.FAILURE]: state => ({ ...state, isLoading: false }),
}), initialState);

const putTodoReducer = createReducer<IInitialState>(actions.makePutTodoCall, s => ({
    [s.SUCCESS]: (state, { payload: { data: updatedTodo } }) => ({
        ...state,
        list: state.list.map((todo: ITodo) => {
            if (todo.id !== updatedTodo.id) {
                return todo;
            }

            return { ...updatedTodo };
        }),
    }),
}), initialState);

export default compose(initialState, getTodosReducer, postTodoReducer, putTodoReducer);