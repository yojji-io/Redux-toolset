import { Reducer } from 'redux';

import { IAction, IActionObject } from '../action-creator';

export function createSimpleReducer<
  State = unknown,
  Payload = unknown,
  Meta = unknown
>(
  actionToHandle: string,
  reducer: Reducer<State, IActionObject<Payload, Meta>>,
  initialState: State
): (state: State, action: IActionObject<Payload, Meta>) => State;

export function createSimpleReducer<
  State = unknown,
  Payload = unknown,
  Meta = unknown
>(
  actionToHandle: IAction,
  reducer: Reducer<State, IActionObject<Payload, Meta>>,
  initialState: State
): (state: State, action: IActionObject<Payload, Meta>) => State;

export function createSimpleReducer(actionToHandle, reducer, initialState) {
  return (state = initialState, action) => {
    const { type: actionType } = action;

    if (actionToHandle.toString() !== actionType || !actionType) {
      return state;
    }

    return reducer(state, action);
  };
}
