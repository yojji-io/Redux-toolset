export const DEFAULT_NAMESPACE_DELIMITER = '/';

export enum ActionStatuses {
    success = 'success',
    failure = 'failure',
    cancel = 'cancel',
}

export type TActionsToHandle = 'DEFAULT' | 'SUCCESS' | 'FAILURE' | 'CANCEL';
