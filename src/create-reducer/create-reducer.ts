import reduceReducers from 'reduce-reducers';
import { Reducer } from 'redux';

import { createSimpleReducer } from '../create-simple-reducer';

import { IAction, IActionObject } from '../action-creator';

import { TActionsToHandle } from '../constants';

type TReducersWrapper = (
  actions: Record<TActionsToHandle, string>
) => Record<string, Reducer>;

type TCreateReducer = <State = any>(
  actionToHandle: IAction,
  reducersWrapper: TReducersWrapper,
  initialState: State
) => (state: State, action: IActionObject) => State;

export const createReducer: TCreateReducer = (
  actionToHandle,
  reducersWrapper,
  initialState
) => {
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
};
