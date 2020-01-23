import { Action, ActionCreator } from 'redux';

import { DEFAULT_NAMESPACE_DELIMITER, ActionStatuses } from '../constants';

export interface IActionObject<P = unknown, M = unknown> extends Action {
  type: string;
  payload?: P;
  meta?: M;
}

interface IOptions {
  meta?: unknown;
}

type TMeta<
  Options extends IOptions,
  ActionCreatorOptions extends IOptions
> = Options extends undefined
  ? ActionCreatorOptions extends IOptions
    ? ActionCreatorOptions['meta']
    : undefined
  : Options['meta'];

export interface IAction<
  StatusesPayload extends IStatuses = IStatuses,
  Options extends IOptions = {},
  ActionCreatorOptions extends IOptions = {}
> extends ActionCreator<StatusesPayload['default']> {
  (payload?: StatusesPayload['default']): IActionObject<
    StatusesPayload['default'],
    TMeta<Options, ActionCreatorOptions>
  >;

  success(
    payload?: StatusesPayload['success']
  ): IActionObject<
    StatusesPayload['success'],
    TMeta<Options, ActionCreatorOptions>
  >;

  failure(
    payload?: StatusesPayload['failure']
  ): IActionObject<
    StatusesPayload['failure'],
    TMeta<Options, ActionCreatorOptions>
  >;

  cancel(
    payload?: StatusesPayload['cancel']
  ): IActionObject<
    StatusesPayload['cancel'],
    TMeta<Options, ActionCreatorOptions>
  >;

  request(
    payload?: StatusesPayload['request']
  ): IActionObject<
    StatusesPayload['request'],
    TMeta<Options, ActionCreatorOptions>
  >;

  toString(): string;
}

export interface IStatuses {
  default?: unknown;
  success?: unknown;
  failure?: unknown;
  cancel?: unknown;
  request?: unknown;
}

export const createAction = <
  StatusesPayload extends IStatuses = IStatuses,
  ActionOptions extends IOptions = undefined,
  ActionCreatorOptions extends IOptions = undefined
>(
  type: string,
  actionOptions?: ActionOptions,
  actionCreatorOptions?: ActionCreatorOptions
): IAction<StatusesPayload, ActionOptions, ActionCreatorOptions> => {
  type Action = IAction<StatusesPayload, ActionOptions, ActionCreatorOptions>;

  const actionCreator = <Payload = unknown>(actionType: string) => (
    actionPayload?: Payload
  ): IActionObject<Payload, TMeta<ActionOptions, ActionCreatorOptions>> => {
    const action: IActionObject<
      Payload,
      TMeta<ActionOptions, ActionCreatorOptions>
    > = {
      type: actionType,
    };

    if (typeof actionPayload === 'boolean' || actionPayload) {
      action.payload = actionPayload;
    }

    if (actionOptions && actionOptions.meta) {
      action.meta = actionOptions.meta as TMeta<
        ActionOptions,
        ActionCreatorOptions
      >;
    } else if (actionCreatorOptions && actionCreatorOptions.meta) {
      action.meta = actionCreatorOptions.meta as TMeta<
        ActionOptions,
        ActionCreatorOptions
      >;
    }

    return action;
  };
  const defaultActionCreator = actionCreator<StatusesPayload['default']>(
    type
  ) as Action;

  defaultActionCreator.toString = (): string => type;

  Object.values(ActionStatuses).reduce<Action>(
    (actionCreatorToSetStatusActions, status: ActionStatuses) => {
      const statusType = `${type}_${status.toUpperCase()}`;
      actionCreatorToSetStatusActions[status] = actionCreator<
        StatusesPayload[ActionStatuses]
      >(statusType);
      actionCreatorToSetStatusActions[status].toString = (): string =>
        statusType;
      return actionCreatorToSetStatusActions;
    },
    defaultActionCreator
  );

  return defaultActionCreator;
};

export const actionNamespaceCreator = (
  namespace: string,
  actionCreatorOptions?: IOptions
) => <
  StatusesPayload extends IStatuses = IStatuses,
  ActionOptions extends IOptions = undefined,
  ActionCreatorOptions extends IOptions = undefined
>(
  type: string,
  actionOptions?: ActionOptions
): IAction<StatusesPayload, ActionOptions, ActionCreatorOptions> => {
  if (!namespace) {
    throw new Error("You didn't provide any namespace");
  }

  const actionType = `${namespace}${DEFAULT_NAMESPACE_DELIMITER}${type}`;

  return createAction(actionType, actionOptions, actionCreatorOptions);
};
