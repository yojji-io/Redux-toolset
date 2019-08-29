import {
    DEFAULT_NAMESPACE_DELIMITER,
} from '../constants';

import {
    IAction,
    IActionObject,
} from '../action-creator';

type TReducer = (state: any, action: IActionObject) => any;

type TCreateSimpleReducer = <State = any>(actionToHandle: IAction, reducer: TReducer, initialState: State) =>
    (state: State, action: IActionObject) => any;

export const createSimpleReducer: TCreateSimpleReducer = (actionToHandle, reducer, initialState) => {
    const types = actionToHandle.toString().split(DEFAULT_NAMESPACE_DELIMITER);

    return (state = initialState, action) => {
        const { type: actionType } = action;

        if (!types.includes(actionType) || !actionType) {
            return state;
        }

        return reducer(state, action);
    };
};
