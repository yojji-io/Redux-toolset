import reduceReducers from 'reduce-reducers';
import { Reducer } from 'redux';

import { IActionObject } from '../action-creator';

type TCompose = <State = unknown>(
  initialState: State,
  ...reducers: Reducer[]
) => (state: State | undefined, action: IActionObject) => State;

export const compose: TCompose = (initialState, ...reducers) => {
  const reducer = reduceReducers(initialState, ...reducers);

  return (state = initialState, action) => reducer(state, action);
};
