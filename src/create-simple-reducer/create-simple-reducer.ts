import { Reducer } from 'redux';

import { IAction, IActionObject } from '../action-creator';

type TCreateSimpleReducer = <
  State = unknown,
  Payload = unknown,
  Meta = unknown
>(
  actionToHandle: IAction | string,
  reducer: Reducer<State, IActionObject<Payload, Meta>>,
  initialState: State
) => (state: State, action: IActionObject<Payload, Meta>) => State;

export const createSimpleReducer: TCreateSimpleReducer = (
  actionToHandle,
  reducer,
  initialState
) => (state = initialState, action) => {
  const { type: actionType } = action;

  if (actionToHandle.toString() !== actionType || !actionType) {
    return state;
  }

  return reducer(state, action);
};
