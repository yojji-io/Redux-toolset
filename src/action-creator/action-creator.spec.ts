import { DEFAULT_NAMESPACE_DELIMITER, ActionStatuses } from '../constants';
import { actionNamespaceCreator, createAction } from './index';

const NAMESPACE = 'NAMESPACE';
const TYPE = 'TYPE';
const ACTION = `${NAMESPACE}${DEFAULT_NAMESPACE_DELIMITER}${TYPE}`;
const PAYLOAD = 'PAYLOAD';

const SUCCESS_ACTION = `${TYPE}_${ActionStatuses.success.toUpperCase()}`;
const FAILURE_ACTION = `${TYPE}_${ActionStatuses.failure.toUpperCase()}`;
const CANCEL_ACTION = `${TYPE}_${ActionStatuses.cancel.toUpperCase()}`;

const ACTION_STATUSES_MAP = {
  [ActionStatuses.success]: SUCCESS_ACTION,
  [ActionStatuses.failure]: FAILURE_ACTION,
  [ActionStatuses.cancel]: CANCEL_ACTION,
};

describe('Creating action', () => {
  describe('ActionCreator', () => {
    test('Create action creator with: namespace', () => {
      const createAction = actionNamespaceCreator(NAMESPACE);
      const action = createAction(TYPE);

      expect(action.toString()).toEqual(ACTION);

      expect(action().type).toEqual(ACTION);

      expect(action(PAYLOAD).payload).toEqual(PAYLOAD);
    });

    test('Throw exception when calling actionNamespaceCreator without namespace', () => {
      expect(actionNamespaceCreator(null)).toThrowError();
    });

    test('Create action creator with: namespace, meta', () => {
      const createAction = actionNamespaceCreator(NAMESPACE, {
        meta: {
          defined: true,
        },
      });
      const action = createAction<{}, { meta: { defined: boolean } }>(TYPE);

      expect(action.toString()).toEqual(ACTION);

      expect(action().type).toEqual(ACTION);

      expect(action(PAYLOAD).payload).toEqual(PAYLOAD);

      expect(action().meta.defined).toBeTruthy();
    });
  });

  describe('Action', () => {
    test('Create action', () => {
      const action = createAction(TYPE);

      expect(action.toString()).toEqual(TYPE);

      expect(action().type).toEqual(TYPE);

      expect(action(PAYLOAD).payload).toEqual(PAYLOAD);
    });

    test('Create action with: meta', () => {
      const action = createAction<{}, { meta: { defined: boolean } }>(TYPE, {
        meta: {
          defined: true,
        },
      });

      expect(action.toString()).toEqual(TYPE);

      expect(action().type).toEqual(TYPE);

      expect(action(PAYLOAD).payload).toEqual(PAYLOAD);

      expect(action().meta.defined).toBeTruthy();
    });
  });

  describe('Action statuses usage', () => {
    Object.entries(ACTION_STATUSES_MAP).forEach(([status, statusType]) => {
      test(`${status} action`, () => {
        const action = createAction(TYPE);

        expect(action[status].toString()).toEqual(statusType);

        expect(action[status]().type).toEqual(statusType);
      });

      test(`${status} action with: meta`, () => {
        const action = createAction(TYPE, {
          meta: {
            defined: true,
          },
        });

        expect(action[status].toString()).toEqual(statusType);

        expect(action[status]().type).toEqual(statusType);

        expect(action[status](PAYLOAD).payload).toEqual(PAYLOAD);

        expect(action[status]().meta.defined).toBeTruthy();
      });
    });
  });
});
