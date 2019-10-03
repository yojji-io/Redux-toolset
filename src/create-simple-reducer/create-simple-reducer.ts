import { Reducer } from 'redux';

import { IAction, IActionObject } from '../action-creator';

export interface IReducer<State, Payload = unknown, Meta = unknown>
  extends Reducer {
  (state: State, action: IActionObject<Payload, Meta>): State;
}

const createReducer = <State = unknown, Payload = unknown, Meta = unknown>(
  actionToHandle: IAction | string,
  handler: Reducer<State, IActionObject<Payload, Meta>>,
  initialState: State
) => (state = initialState, action: IActionObject<Payload, Meta>): State => {
  const { type: actionType } = action;

  if (actionToHandle.toString() !== actionType || !actionType) {
    return state;
  }

  return handler(state, action);
};

export function createSimpleReducer<
  State = unknown,
  Payload = unknown,
  Meta = unknown
>(
  actionToHandle: IAction | string,
  handler: Reducer<State, IActionObject<Payload, Meta>>,
  initialState: State
): IReducer<State, Payload, Meta>;

export function createSimpleReducer<
  State = unknown,
  Payload = unknown,
  Meta = unknown
>(
  actionTOHandle: IAction | string,
  handler: Reducer<State, IActionObject<Payload, Meta>>,
  initialState?
): (curriedInitialState: State) => IReducer<State, Payload, Meta>;

export function createSimpleReducer<State, Payload, Meta>(
  actionToHandle,
  handler,
  initialState
): unknown {
  if (initialState) {
    return createReducer<State, Payload, Meta>(
      actionToHandle,
      handler,
      initialState
    );
  } else {
    return (curriedInitialState: State): IReducer<State, Payload, Meta> =>
      createReducer<State, Payload, Meta>(
        actionToHandle,
        handler,
        curriedInitialState
      );
  }
}
