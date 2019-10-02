import { fork } from 'redux-saga/effects';
import { createAndRunApiSagas } from '@yojji/core';

import todosSaga from './modules/todos/todos.sagas';

import * as api from '../api';

import {
    makeGetTodosCall,
    makePostTodoCall,
    makePutTodoCall,
} from './modules/todos/todos.actions';

const apiMap = [
    { action: makeGetTodosCall, api: api.getTodos },
    { action: makePostTodoCall, api: api.postTodo },
    { action: makePutTodoCall, api: api.putTodo },
];

export let workers = {};

export default function * rootSaga() {
    // @ts-ignore
    const { workers: createWorkers } = yield * createAndRunApiSagas(apiMap);
    workers = createWorkers;

    yield fork(todosSaga);
}
