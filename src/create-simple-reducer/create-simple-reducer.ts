import { Reducer } from 'redux';

import { IAction, IActionObject } from '../action-creator';

type TCreateSimpleReducer = <State = unknown, Meta = unknown>(
  actionToHandle: IAction | string,
  reducer: Reducer<
    State,
    IActionObject<
      typeof actionToHandle extends string
        ? unknown
        : ReturnType<typeof actionToHandle>,
      Meta
    >
  >,
  initialState: State
) => (state: State, action: IActionObject<any, Meta>) => State;

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
