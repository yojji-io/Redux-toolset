import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { call } from 'redux-saga/effects';

import {
    createAndRunApiSagas,
    createWatcher,
    createWorker,
} from './index';

import {
    createAction,
} from '../action-creator';

import {
    createReducer,
} from '../create-reducer';

const initialState = {
    success: false,
    failure: false,
    cancel: false,
};

const action = createAction('ACTION');

const reducer = createReducer(action, ({ SUCCESS, DEFAULT, FAILURE, CANCEL }) => ({
    [SUCCESS]: (state, { payload }) => ({ ...state, success: payload }),
    [FAILURE]: (state, { payload }) => ({ ...state, failure: payload }),
    [CANCEL]: (state) => ({ ...state, cancel: true }),
}), initialState);

describe('Test saga helpers', () => {
    describe('Test createWorker', () => {
        test('Worker should call api and dispatch action with success to reducer', async () => {
            const api = () => new Promise(resolve => resolve(true));

            const worker = createWorker({ api, action });

            const saga = expectSaga(worker)
                .provide([
                    [call(api), true],
                ])
                .withReducer(reducer, initialState);

            const result = await saga.run();

            expect(result.storeState.success).toBeTruthy();
        });

        test('Worker should dispatch action with failure to reducer', async () => {
            const api = () => new Promise((resolve, reject) => reject(true));

            const worker = createWorker({ api, action });

            const saga = expectSaga(worker)
                .provide([
                    [call(api), throwError(new Error())],
                ])
                .withReducer(reducer, initialState);

            const result = await saga.run();

            expect(result.storeState.failure).toBeTruthy();
        });

        test('Worker should dispatch action with cancel to reducer', async () => {
            const api = () => new Promise(resolve => setTimeout(resolve, 5000));

            const worker = createWorker({ api, action });

            const saga = expectSaga(worker)
                .provide({
                    cancelled: () => true,
                })
                .withReducer(reducer, initialState);

            const result  = await saga.silentRun();

            expect(result.storeState.cancel).toBeTruthy();
        });
    });

    describe('Test createWatcher', () => {
        test('Watcher should run worker', async () => {
            const api = () => new Promise(resolve => resolve(true));

            const saga = expectSaga(createWatcher, { api, action })
                .withReducer(reducer, initialState)
                .dispatch(action());

            const result = await saga.silentRun();

            expect(result.storeState.success).toBeTruthy();
        });

        test('Watcher should cancel worker', async () => {
            const api = () => new Promise(resolve => setTimeout(
                () => resolve(true),
                5000,
            ));

            const saga = expectSaga(createWatcher, { api, action })
                .withReducer(reducer, initialState)
                .dispatch(action())
                .dispatch(action.cancel());

            const result = await saga.silentRun();

            expect(result.storeState.cancel).toBeTruthy();
        });
    });

    describe('Test createAndRunApiSagas', () => {
        test('Watcher should run worker', async () => {
            const api = () => new Promise(resolve => resolve(true));

            const saga = expectSaga(createAndRunApiSagas, [{ api, action }])
                .withReducer(reducer, initialState)
                .dispatch(action());

            const result = await saga.silentRun();

            expect(result.storeState.success).toBeTruthy();
        });

        test('Watcher should cancel worker', async () => {
            const api = () => new Promise(resolve => resolve());

            const saga = expectSaga(createAndRunApiSagas, [{ api, action }])
                .provide([
                    [call(api), setTimeout(null, 5000)],
                ])
                .withReducer(reducer, initialState)
                .dispatch(action())
                .dispatch(action.cancel());

            const result = await saga.silentRun();

            expect(result.storeState.cancel).toBeTruthy();
        });

        test('Watcher should rerun worker', async () => {
            const api = () => new Promise(resolve => resolve(true));

            const saga = expectSaga(createAndRunApiSagas, [{ api, action }])
                .provide([
                    [call(api), setTimeout(() => true, 100)],
                ])
                .withReducer(reducer, initialState)
                .dispatch(action())
                .dispatch(action.cancel())
                .dispatch(action());

            const result = await saga.silentRun();

            expect(result.storeState.success).toBeTruthy();
            expect(result.storeState.cancel).toBeTruthy();
        });
    });
});
