import { compose } from './index';

import { createAction, IActionObject, IAction } from '../action-creator';

import { createSimpleReducer } from '../create-simple-reducer';

import { createReducer } from '../create-reducer';

const TYPE_A = 'TYPE_A';
const TYPE_B = 'TYPE_B';

const actionA = createAction(TYPE_A);
const actionB = createAction(TYPE_B);

interface IInitialState {
  a: number;
  b: number;
}

const initialState: IInitialState = {
  a: 0,
  b: 0,
};

const reducerA = (state: IInitialState, action: IActionObject<number>) => ({
  ...state,
  a: state.a + action.payload,
});

const reducerB = (state: IInitialState, action: IActionObject<number>) => ({
  ...state,
  b: state.b + action.payload,
});

const reducerCreator = (action: IAction) =>
  createReducer<IInitialState>(
    action,
    ({ DEFAULT, SUCCESS }) => ({
      [DEFAULT]: (state: IInitialState, action: IActionObject<number>) => ({
        ...state,
        a: state.a + action.payload,
      }),
      [SUCCESS]: (state: IInitialState, action: IActionObject<number>) => ({
        ...state,
        b: state.b + action.payload,
      }),
    })
  );

describe('Compose', () => {
  test('Handle simple reducers', () => {
    const rA = createSimpleReducer(actionA, reducerA);
    const rB = createSimpleReducer(actionB, reducerB);
    const reducer = compose(
      initialState,
      rA,
      rB
    );

    const testReducers = () => {
      let state: IInitialState;
      state = reducer(initialState, actionA(1));
      state = reducer(state, actionB(1));
      return state;
    };

    expect(testReducers()).toEqual({ a: 1, b: 1 });
  });

  test('Handle reducers', () => {
    const r1 = reducerCreator(actionA);
    const r2 = reducerCreator(actionB);
    const reducer = compose(
      initialState,
      r1,
      r2
    );

    const testReducers = () => {
      let state: IInitialState;
      state = reducer(initialState, actionA(1));
      state = reducer(state, actionA.success(1));
      state = reducer(state, actionB(1));
      state = reducer(state, actionB.success(1));
      return state;
    };

    expect(testReducers()).toEqual({ a: 2, b: 2 });
  });

  test('Handle mixed: simple reducer and reducer', () => {
    const r1 = reducerCreator(actionA);
    const rB = createSimpleReducer(actionB, reducerB);
    const reducer = compose(
      initialState,
      r1,
      rB
    );

    const testReducers = () => {
      let state: IInitialState;
      state = reducer(initialState, actionA(1));
      state = reducer(state, actionB(1));
      state = reducer(state, actionA.success(1));
      return state;
    };

    expect(testReducers()).toEqual({ a: 1, b: 2 });
  });

  test('Usage without state provided (redux initial action)', () => {
    const r1 = reducerCreator(actionA);
    const rB = createSimpleReducer(actionB, reducerB);
    const reducer = compose(
      initialState,
      r1,
      rB
    );

    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  test('Usage with different action', () => {
    const r1 = reducerCreator(actionA);
    const rB = createSimpleReducer(actionB, reducerB);
    const reducer = compose(
      initialState,
      r1,
      rB
    );

    expect(reducer(initialState, { type: 'ANOTHER_ACTION' })).toEqual(
      initialState
    );
  });
});
