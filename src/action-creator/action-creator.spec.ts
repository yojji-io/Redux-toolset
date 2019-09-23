import { DEFAULT_NAMESPACE_DELIMITER, ActionStatuses } from '../constants';
import { actionNamespaceCreator, createAction } from './index';

const NAMESPACE = 'NAMESPACE';
const TYPE = 'TYPE';
const ACTION = `${NAMESPACE}${DEFAULT_NAMESPACE_DELIMITER}${TYPE}`;
const PAYLOAD = 'PAYLOAD';
const PAYLOAD_MODIFIED = 'PAYLOAD_MODIFIED';

const SUCCESS_ACTION = `${TYPE}_${ActionStatuses.success.toUpperCase()}`;
const FAILURE_ACTION = `${TYPE}_${ActionStatuses.failure.toUpperCase()}`;
const CANCEL_ACTION = `${TYPE}_${ActionStatuses.cancel.toUpperCase()}`;

const ACTION_STATUSES_MAP = {
  [ActionStatuses.success]: SUCCESS_ACTION,
  [ActionStatuses.failure]: FAILURE_ACTION,
  [ActionStatuses.cancel]: CANCEL_ACTION,
};

const payloadCreator = (payload: string) => {
  return `${payload}_MODIFIED`;
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

    test('Create action creator with: namespace, payload creator', () => {
      const createAction = actionNamespaceCreator(NAMESPACE, {
        payloadCreator,
      });
      const action = createAction(TYPE);

      expect(action.toString()).toEqual(ACTION);

      expect(action().type).toEqual(ACTION);

      expect(action(PAYLOAD).payload).toEqual(PAYLOAD_MODIFIED);
    });

    test('Create action creator with: namespace, payload creator, meta', () => {
      const createAction = actionNamespaceCreator(NAMESPACE, {
        payloadCreator,
        meta: {
          defined: true,
        },
      });
      const action = createAction(TYPE);

      expect(action.toString()).toEqual(ACTION);

      expect(action().type).toEqual(ACTION);

      expect(action(PAYLOAD).payload).toEqual(PAYLOAD_MODIFIED);

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

    test('Create action with: payload creator', () => {
      const action = createAction(TYPE, {
        payloadCreator,
      });

      expect(action.toString()).toEqual(TYPE);

      expect(action().type).toEqual(TYPE);

      expect(action(PAYLOAD).payload).toEqual(PAYLOAD_MODIFIED);
    });

    test('Create action with: payload creator, meta', () => {
      const action = createAction(TYPE, {
        payloadCreator,
        meta: {
          defined: true,
        },
      });

      expect(action.toString()).toEqual(TYPE);

      expect(action().type).toEqual(TYPE);

      expect(action(PAYLOAD).payload).toEqual(PAYLOAD_MODIFIED);

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

      test(`${status} action with: payload creator`, () => {
        const action = createAction(TYPE, {
          payloadCreator,
        });

        expect(action[status].toString()).toEqual(statusType);

        expect(action[status]().type).toEqual(statusType);

        expect(action[status](PAYLOAD).payload).toEqual(PAYLOAD_MODIFIED);
      });

      test(`${status} action with: payload creator, meta`, () => {
        const action = createAction(TYPE, {
          payloadCreator,
          meta: {
            defined: true,
          },
        });

        expect(action[status].toString()).toEqual(statusType);

        expect(action[status]().type).toEqual(statusType);

        expect(action[status](PAYLOAD).payload).toEqual(PAYLOAD_MODIFIED);

        expect(action[status]().meta.defined).toBeTruthy();
      });
    });
  });
});
