import reduceReducers from 'reduce-reducers';

import { IReducer } from '../create-simple-reducer';

export const compose = <State>(
  initialState: State,
  ...curriedReducers: Array<(curriedInitialState: State) => IReducer<State>>
) => {
  const reducers = curriedReducers.map(curriedReducer =>
    curriedReducer(initialState)
  );
  const reducer = reduceReducers<State>(initialState, ...reducers);

  return (state = initialState, action) => reducer(state, action);
};
