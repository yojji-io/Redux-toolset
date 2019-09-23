import { createSimpleReducer } from './index';

import {
  createAction,
  actionNamespaceCreator,
  IActionObject,
} from '../action-creator';

import { DEFAULT_NAMESPACE_DELIMITER } from '../constants';

const NAMESPACE = 'NAMESPACE';
const TYPE = 'TYPE';
const ACTION = `${NAMESPACE}${DEFAULT_NAMESPACE_DELIMITER}${TYPE}`;

const action = createAction(TYPE);

const createNamespacedAction = actionNamespaceCreator(NAMESPACE);
const namespacedAction = createNamespacedAction(TYPE);

interface IInitialState {
  a: number;
}

const initialState: IInitialState = {
  a: 0,
};

const state: IInitialState = {
  a: 5,
};

const upReducer = (state: IInitialState, action: IActionObject) => ({
  ...state,
  a: state.a + 1,
});

describe('Simple reducer', () => {
  describe('Handle action without namespace', () => {
    test('Usage with action', () => {
      const reducer = createSimpleReducer(action, upReducer, initialState);
      expect(reducer(state, action())).toHaveProperty('a', 6);
    });

    test('Usage without state provided (redux initial action)', () => {
      const reducer = createSimpleReducer(action, upReducer, initialState);
      expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    test('Usage with different action', () => {
      const reducer = createSimpleReducer(action, upReducer, initialState);
      expect(reducer(state, { type: 'ANOTHER_ACTION' })).toEqual(state);
    });
  });

  describe('Handle namespaced action', () => {
    test('Usage with action', () => {
      const reducer = createSimpleReducer(namespacedAction, upReducer, state);
      expect(reducer(state, namespacedAction())).toHaveProperty('a', 6);
    });

    test('Usage without state provided (redux initial action)', () => {
      const reducer = createSimpleReducer(
        namespacedAction,
        upReducer,
        initialState
      );
      expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    test('Usage with different action', () => {
      const reducer = createSimpleReducer(
        namespacedAction,
        upReducer,
        initialState
      );
      expect(reducer(state, { type: 'ANOTHER_ACTION' })).toEqual(state);
    });
  });
});
