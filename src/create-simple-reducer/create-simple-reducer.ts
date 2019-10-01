import { Reducer } from 'redux';

import { IAction, IActionObject } from '../action-creator';

interface IReducer<State, Payload, Meta> extends Reducer {
  (state: State, action: IActionObject<Payload, Meta>): State;
}

type TCurryInitialState<State, Payload, Meta> = (
  initialState: State
) => IReducer<State, Payload, Meta>;

export const createReducer = <
  State = unknown,
  Payload = unknown,
  Meta = unknown
>(
  actionToHandle: IAction,
  handler: Reducer<State, IActionObject<Payload, Meta>>,
  initialState: State
) => (state = initialState, action: IActionObject<Payload, Meta>): State => {
  const { type: actionType } = action;

  if (actionToHandle.toString() !== actionType || !actionType) {
    return state;
  }

  return handler(state, action);
};

export const createSimpleReducer = <
  State = unknown,
  Payload = unknown,
  Meta = unknown
>(
  actionToHandle: IAction,
  handler: Reducer<State, IActionObject<Payload, Meta>>,
  initialState?: State
): typeof initialState extends unknown
  ? TCurryInitialState<State, Payload, Meta>
  : IReducer<State, Payload, Meta> => {
  return initialState
    ? createReducer<State, Payload, Meta>(actionToHandle, handler, initialState)
    : (curriedInitialState: State) =>
        createReducer<State, Payload, Meta>(
          actionToHandle,
          handler,
          curriedInitialState
        );
};
