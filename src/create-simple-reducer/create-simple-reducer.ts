import { Reducer } from 'redux';

import { IAction, IActionObject } from '../action-creator';

// type TCreateSimpleReducer = <State = unknown, Meta = unknown>(
//   actionToHandle: IAction | string,
//   reducer: Reducer<
//     State,
//     IActionObject<
//       typeof actionToHandle extends string
//         ? unknown
//         : ReturnType<typeof actionToHandle>,
//       Meta
//     >
//   >,
//   initialState: State
// ) => (state: State, action: IActionObject<any, Meta>) => State;

// interface ICreateSimpleReducer {
//   <State = unknown, Meta = unknown>(
//     actionToHandle: string,
//     reducer: Reducer<State, IActionObject<unknown, Meta>>,
//     initialState: State
//   ): (state: State, action: IActionObject<unknown, Meta>) => State;
//
//   <State = unknown, Meta = unknown>(
//     actionToHandle: IAction,
//     reducer: Reducer<
//       State,
//       IActionObject<ReturnType<typeof actionToHandle>, Meta>
//     >,
//     initialState: State
//   ): (
//     state: State,
//     action: IActionObject<ReturnType<typeof actionToHandle>, Meta>
//   ) => State;
// }

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
