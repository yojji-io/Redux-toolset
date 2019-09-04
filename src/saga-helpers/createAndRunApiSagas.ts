import { call, cancelled, put, take, fork, race, spawn } from 'redux-saga/effects';
import { Task, SagaIterator } from 'redux-saga';

import {
    IAction,
} from '../action-creator';

interface IApi {
    api: () => Promise<any>;
    action: IAction;
}

export function * createAndRunApiSagas(apiList: IApi[]): SagaIterator {
    const workers: Record<string, Generator> = apiList.reduce((acc, api) => {
        const worker = createWorker(api);
        return { ...acc, [api.action.toString()]: worker };
    }, {});

    for (const api of apiList) {
        yield spawn(createWatcher, api);
    }

    return { workers };
}

export function * createWatcher({ api, action }: IApi) {
    const worker = createWorker({ api, action });

    function * watcher() {
        while (true) {
            yield take(action);
            yield race({
                _: call(worker),
                cancel: take(action.cancel),
            });
        }
    }

    yield fork(watcher);
}

export const createWorker = ({ api, action }: IApi) => function *() {
        try {
            const response = yield call(api);
            yield put(action.success(response));
        } catch (err) {
            yield put(action.failure(err));
        } finally {
            if (yield cancelled()) {
                yield put(action.cancel());
            }
        }
    };
