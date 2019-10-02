import reduceReducers from 'reduce-reducers';
import { Reducer } from 'redux';

import { createSimpleReducer } from '../create-simple-reducer';

import { IAction } from '../action-creator';

import { TActionsToHandle } from '../constants';

type TReducersWrapper = (
  actions: Record<TActionsToHandle, string>
) => Record<string, Reducer>;

function generateReducer<State>(
  actionToHandle: IAction,
  reducersWrapper: TReducersWrapper,
  initialState: State
): Reducer<State> {
  const DEFAULT = actionToHandle.toString();
  const SUCCESS = actionToHandle.success.toString();
  const FAILURE = actionToHandle.failure.toString();
  const CANCEL = actionToHandle.cancel.toString();
  const REQUEST = actionToHandle.request.toString();

  const reducers = reducersWrapper({
    DEFAULT,
    SUCCESS,
    FAILURE,
    CANCEL,
    REQUEST,
  });

  const simpleReducers = Object.entries(reducers).map(([type, statusReducer]) =>
    createSimpleReducer(type, statusReducer, initialState)
  );

  const reducer = reduceReducers(initialState, ...simpleReducers);

  return (state = initialState, action) => reducer(state, action);
}

export function createReducer<State>(
  actionToHandle: IAction,
  reducersWrapper: TReducersWrapper,
  initialState: State
): Reducer<State>;

export function createReducer<State>(
  actionToHandle: IAction,
  reducersWrapper: TReducersWrapper,
  initialState?
): (curriedInitialState: State) => Reducer<State>;

export function createReducer<State>(
  actionToHandle,
  reducersWrapper,
  initialState
): unknown {
  if (initialState) {
    return generateReducer<State>(
      actionToHandle,
      reducersWrapper,
      initialState
    );
  } else {
    return (curriedInitialState: State) =>
      generateReducer<State>(
        actionToHandle,
        reducersWrapper,
        curriedInitialState
      );
  }
}
