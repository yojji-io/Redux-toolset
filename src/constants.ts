export const DEFAULT_NAMESPACE_DELIMITER = '/';

export enum ActionStatuses {
    success = 'success',
    failure = 'failure',
    cancelled = 'cancelled',
}

export type TActionsToHandle = 'DEFAULT' | 'SUCCESS' | 'FAILURE' | 'CANCELLED';
