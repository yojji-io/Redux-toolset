export const DEFAULT_NAMESPACE_DELIMITER = '/';

export enum ActionStatuses {
    success = 'success',
    failure = 'failure',
    cancel = 'cancel',
    request = 'request',
}

export type TActionsToHandle = 'DEFAULT' | 'SUCCESS' | 'FAILURE' | 'CANCEL' | 'REQUEST';
