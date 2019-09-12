import { fork, take, put, race, select } from 'redux-saga/effects';

import * as actions from './todos.actions';

import {
    ITodo,
} from './todos.reducer';

import {
    selectTodoById,
} from './todos.selectors';

export default function * todosSaga() {
    yield fork(getTodosSaga);
    yield fork(addTodoSaga);
    yield fork(changeTodoStatusSaga);
}

function * getTodosSaga() {
    while (true) {
        yield take(actions.getTodos);
        yield put(actions.makeGetTodosCall());
    }
}

function * addTodoSaga() {
    while (true) {
        const { payload: todo } = yield take(actions.addTodo);
        yield put(actions.makePostTodoCall({ text: todo, complete: false }));

        const [failure] = yield race([
            take(actions.makePostTodoCall.failure),
            take(actions.makePostTodoCall.success),
        ]);

        if (failure) {
            continue;
        }

        yield put(actions.makeGetTodosCall());
    }
}

function * changeTodoStatusSaga() {
    while (true) {
        const { payload: todoId } = yield take(actions.changeTodoStatus);
        const todoSelector = yield select(selectTodoById);
        const todo: ITodo = todoSelector(todoId);
        const updatedTodo = {
            ...todo,
            complete: !todo.complete,
        };
        yield put(actions.makePutTodoCall(updatedTodo));
    }
}
