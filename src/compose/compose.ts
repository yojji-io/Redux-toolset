import reduceReducers from 'reduce-reducers';

import {
    TReducer,
} from '../create-simple-reducer';

import {
    IActionObject,
} from '../action-creator';

type TCompose = <State = any>(initialState: State, ...reducers: TReducer[]) =>
    (state: State | undefined, action: IActionObject) => State;

export const compose: TCompose = (initialState, ...reducers) => {
    const reducer = reduceReducers(initialState, ...reducers);

    return (state = initialState, action) => reducer(state, action);
};
