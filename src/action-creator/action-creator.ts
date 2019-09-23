import { Action, ActionCreator } from 'redux';

import { DEFAULT_NAMESPACE_DELIMITER, ActionStatuses } from '../constants';

export interface IActionObject<P = unknown, M = unknown> extends Action {
  type: string;
  payload?: P;
  meta?: M;
}

interface IOptions<P = unknown, R = unknown> {
  meta?: unknown;
  payloadCreator?: (payload: P) => R;
}

export interface IAction<
  P = unknown,
  S = unknown,
  F = unknown,
  C = unknown,
  R = unknown
> extends ActionCreator<P> {
  (payload?: P): IActionObject<P>;

  success(payload?: S): IActionObject<S>;

  failure(payload?: F): IActionObject<F>;

  cancel(payload?: C): IActionObject<C>;

  request(payload?: R): IActionObject;

  toString(): string;
}

type TCreateAction = (
  type: string,
  actionOptions?: IOptions,
  actionCreatorOptions?: IOptions
) => IAction;

type TActionNamespaceCreator = (
  namespace: string,
  actionCreatorOptions?: IOptions
) => TCreateAction;

export const createAction = <
  P = unknown,
  S = unknown,
  F = unknown,
  C = unknown,
  R = unknown
>(
  type: string,
  actionOptions: IOptions = {},
  actionCreatorOptions: IOptions = {}
): IAction<P, S, F, C, R> => {
  const actionCreator = (actionType: string) => (
      actionPayload?: P | S | F | C | R
    ): IActionObject => {
      const action: IActionObject = {
        type: actionType,
      };

      let payload: unknown = actionPayload;

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
    },
    defaultActionCreator = actionCreator(type);
  defaultActionCreator.toString = (): string => type;

  Object.values(ActionStatuses).reduce(
    (actionCreatorToSetStatusActions, status) => {
      const statusType = `${type}_${status.toUpperCase()}`;
      actionCreatorToSetStatusActions[status] = actionCreator(statusType);
      actionCreatorToSetStatusActions[status].toString = (): string =>
        statusType;
      return actionCreatorToSetStatusActions;
    },
    defaultActionCreator
  );

  return defaultActionCreator as IAction<P, S, F, C>;
};

export const actionNamespaceCreator: TActionNamespaceCreator = (
  namespace,
  actionCreatorOptions = {}
) => <P, S, F, C, R>(type, actionOptions = {}): IAction => {
  if (!namespace) {
    throw new Error("You didn't provide any namespace");
  }

  const actionType = `${namespace}${DEFAULT_NAMESPACE_DELIMITER}${type}`;

  const action = createAction<P, S, F, C, R>(
    actionType,
    actionOptions,
    actionCreatorOptions
  );

  return action;
};
