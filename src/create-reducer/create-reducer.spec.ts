import { createReducer } from './index';

import {
  createAction,
  actionNamespaceCreator,
  IActionObject,
  IAction,
} from '../action-creator';

const NAMESPACE = 'NAMESPACE';
const TYPE = 'TYPE';

const action = createAction(TYPE);

const createNamespacedAction = actionNamespaceCreator(NAMESPACE);
const namespacedAction = createNamespacedAction(TYPE);

interface IInitialState {
  default: boolean;
  success: boolean;
  failure: boolean;
  cancel: boolean;
}

const initialState: IInitialState = {
  default: false,
  success: false,
  failure: false,
  cancel: false,
};

const reducerCreator = (action: IAction) =>
  createReducer(
    action,
    ({ DEFAULT, SUCCESS, FAILURE, CANCEL }) => ({
      [DEFAULT]: (state: IInitialState, action: IActionObject) => ({
        ...state,
        default: action.payload,
      }),
      [SUCCESS]: (state: IInitialState, action: IActionObject) => ({
        ...state,
        success: action.payload,
      }),
      [FAILURE]: (state: IInitialState, action: IActionObject) => ({
        ...state,
        failure: action.payload,
      }),
      [CANCEL]: (state: IInitialState, action: IActionObject) => ({
        ...state,
        cancel: action.payload,
      }),
    }),
    initialState
  );

describe('Reducer', () => {
  describe('Handle action without namespace', () => {
    describe('Usage with action', () => {
      const reducer = reducerCreator(action);

      test('Default action', () => {
        expect(reducer(initialState, action(true))).toHaveProperty(
          'default',
          true
        );
      });

      test('Success action', () => {
        expect(reducer(initialState, action.success(true))).toHaveProperty(
          'success',
          true
        );
      });

      test('Failure action', () => {
        expect(reducer(initialState, action.failure(true))).toHaveProperty(
          'failure',
          true
        );
      });

      test('cancel action', () => {
        expect(reducer(initialState, action.cancel(true))).toHaveProperty(
          'cancel',
          true
        );
      });
    });

    test('Curried reducer', () => {
      const curriedReducer = createReducer(action, ({ DEFAULT }) => ({
        [DEFAULT]: (state: IInitialState, action: IActionObject) => ({
          ...state, default: action.payload
        })
      }));
      const reducer = curriedReducer(initialState);

      expect(reducer(initialState, action(true))).toHaveProperty(
          'default',
          true
      );
    });

    test('Usage without state provided (redux initial action)', () => {
      const reducer = reducerCreator(action);

      expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    test('Usage with different action', () => {
      const reducer = reducerCreator(action);

      expect(reducer(initialState, { type: 'ANOTHER_ACTION' })).toEqual(
        initialState
      );
    });
  });

  describe('Handle namespaced action', () => {
    describe('Usage with action', () => {
      const reducer = reducerCreator(namespacedAction);

      test('Default action', () => {
        expect(reducer(initialState, namespacedAction(true))).toHaveProperty(
          'default',
          true
        );
      });

      test('Success action', () => {
        expect(
          reducer(initialState, namespacedAction.success(true))
        ).toHaveProperty('success', true);
      });

      test('Failure action', () => {
        expect(
          reducer(initialState, namespacedAction.failure(true))
        ).toHaveProperty('failure', true);
      });

      test('Cancel action', () => {
        expect(
          reducer(initialState, namespacedAction.cancel(true))
        ).toHaveProperty('cancel', true);
      });
    });

    test('Usage without state provided (redux initial action)', () => {
      const reducer = reducerCreator(namespacedAction);

      expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    test('Usage with different action', () => {
      const reducer = reducerCreator(namespacedAction);

      expect(reducer(initialState, { type: 'ANOTHER_ACTION' })).toEqual(
        initialState
      );
    });
  });
});
