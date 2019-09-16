import { SagaIterator } from 'redux-saga';

import {
  call,
  cancelled,
  put,
  take,
  fork,
  race,
  spawn,
} from 'redux-saga/effects';

import { IAction } from '../action-creator';

interface IApi {
  api: (data?: unknown) => unknown;
  action: IAction;
}

export const createWorker = ({ api, action }: IApi) =>
  function*(data?: unknown) {
    try {
        const response = yield call(api, data);
        yield put(action.success(response));
    } catch (err) {
        yield put(action.failure(err));
    } finally {
        if (yield cancelled()) {
            yield put(action.cancel());
        }
    }
};

export function* createWatcher({ api, action }: IApi) {
    const worker = createWorker({ api, action });

    function* watcher() {
        while (true) {
            const { payload } = yield take(action);
            yield race({
                _: call(worker, payload),
                cancel: take(action.cancel),
            });
        }
    }

    yield fork(watcher);
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
