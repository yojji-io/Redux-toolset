import {
    DEFAULT_NAMESPACE_DELIMITER,
    ActionStatuses,
} from '../constants';

interface IActionObject {
    type: string;
    payload?: any;
    meta?: any;
}

interface IOptions {
    meta?: any;
    payloadCreator?: (payload: any) => any;
}

interface IAction {
    (payload?: any): IActionObject;

    success(payload?: any): IActionObject;

    failure(payload?: any): IActionObject;

    cancelled(payload?: any): IActionObject;

    toString(): string;
}

type TCreateAction = (type: string, actionOptions?: IOptions, actionCreatorOptions?: IOptions) => IAction;

type TActionNamespaceCreator = (namespace: string, actionCreatorOptions?: IOptions) => TCreateAction;

export const createAction: TCreateAction = (type, actionOptions = {},  actionCreatorOptions = {}) => {
    const actionCreator = (actionType: string) => (actionPayload?: any) => {
        const action: IActionObject = {
            type: actionType,
        };

        let payload: any = actionPayload;

        if (actionOptions.payloadCreator) {
            payload = actionOptions.payloadCreator(actionPayload);
        } else if (actionCreatorOptions.payloadCreator) {
            payload = actionCreatorOptions.payloadCreator(actionPayload);
        }

        if (payload) {
            action.payload = payload;
        }

        if (actionOptions.meta) {
            action.meta = actionOptions.meta;
        } else if (actionCreatorOptions.meta) {
            action.meta = actionCreatorOptions.meta;
        }

        return action;
    };

    const defaultActionCreator = actionCreator(type);
    defaultActionCreator.toString = () => type;

    Object.values(ActionStatuses).reduce((actionCreatorToSetStatusActions, status) => {
        const statusType = `${type}_${status.toUpperCase()}`;
        actionCreatorToSetStatusActions[status] = actionCreator(statusType);
        actionCreatorToSetStatusActions[status].toString = () => statusType;
        return actionCreatorToSetStatusActions;
    }, defaultActionCreator);

    return defaultActionCreator as IAction;
};

export const actionNamespaceCreator: TActionNamespaceCreator = (namespace, actionCreatorOptions = {}) =>
    (type, actionOptions = {}) => {
        if (!namespace) {
            throw new Error('You didn\'t provide any namespace');
        }

        const actionType = `${namespace}${DEFAULT_NAMESPACE_DELIMITER}${type}`;

        const action = createAction(actionType, actionOptions, actionCreatorOptions);

        return action;
    };
