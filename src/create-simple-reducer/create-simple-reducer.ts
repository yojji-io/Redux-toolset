import {
    IAction,
    IActionObject,
} from '../action-creator';

export type TReducer<State = any> = (state: State, action: IActionObject) => State;

type TCreateSimpleReducer = <State = any>(actionToHandle: IAction | string, reducer: TReducer<State>, initialState: State) =>
    (state: State, action: IActionObject) => State;

export const createSimpleReducer: TCreateSimpleReducer = (actionToHandle, reducer, initialState) => {
    return (state = initialState, action) => {
        const { type: actionType } = action;

        if (actionToHandle.toString() !== actionType || !actionType) {
            return state;
        }

        return reducer(state, action);
    };
};
