import * as redux from 'redux';
import * as devtools from 'redux-devtools-extension/developmentOnly';

import { createStore } from './index';

describe('Configure store', () => {
  jest.spyOn(redux, 'createStore');
  jest.spyOn(redux, 'combineReducers');
  jest.spyOn(redux, 'applyMiddleware');
  jest.spyOn(redux, 'compose');
  jest.spyOn(devtools, 'composeWithDevTools');

  test('Create reducer from function', () => {
    const reducer: redux.Reducer = (state = {}) => state;

    createStore({ reducer });
    expect(createStore({ reducer })).toBeInstanceOf(Object);
    expect(redux.applyMiddleware).toHaveBeenCalled();
    expect(devtools.composeWithDevTools).toHaveBeenCalled();
    expect(redux.createStore).toHaveBeenCalledWith(
      reducer,
      undefined,
      expect.any(Function)
    );
  });

  test('Create reducer from object of reducers', () => {
    const reducer = {
      reducer: () => true,
    };

    expect(createStore({ reducer })).toBeInstanceOf(Object);
    expect(redux.combineReducers).toHaveBeenCalledWith(reducer);
    expect(redux.applyMiddleware).toHaveBeenCalled();
    expect(devtools.composeWithDevTools).toHaveBeenCalled();
    expect(redux.createStore).toHaveBeenCalledWith(
      expect.any(Function),
      undefined,
      expect.any(Function)
    );
  });

  test('No options provided', () => {
    expect(createStore).toThrowError('No options provided');
  });

  test('No reducer provided', () => {
    expect(() => createStore({ reducer: null })).toThrowError(
      'Reducer must be a function or an object that can be passed to combineReducers'
    );
  });

  test('No middleware provided', () => {
    const reducer: redux.Reducer = (state = {}) => state;

    expect(createStore({ middleware: [], reducer })).toBeInstanceOf(Object);
    expect(redux.applyMiddleware).toHaveBeenCalledWith();
    expect(devtools.composeWithDevTools).toHaveBeenCalled();
    expect(redux.createStore).toHaveBeenCalledWith(
      reducer,
      undefined,
      expect.any(Function)
    );
  });

  test('Middleware provided', () => {
    const reducer: redux.Reducer = (state = {}) => state;
    const middleware: redux.Middleware = store => next => action =>
      next(action);

    expect(createStore({ middleware: [middleware], reducer })).toBeInstanceOf(
      Object
    );
    expect(redux.applyMiddleware).toHaveBeenCalledWith(middleware);
    expect(devtools.composeWithDevTools).toHaveBeenCalled();
    expect(redux.createStore).toHaveBeenCalledWith(
      reducer,
      undefined,
      expect.any(Function)
    );
  });

  test('Preloaded state', () => {
    const reducer: redux.Reducer = (state = {}) => state;
    expect(createStore({ reducer })).toBeInstanceOf(Object);
    expect(redux.applyMiddleware).toHaveBeenCalled();
    expect(devtools.composeWithDevTools).toHaveBeenCalled();
    expect(redux.createStore).toHaveBeenCalledWith(
      reducer,
      undefined,
      expect.any(Function)
    );
  });

  test('Enhancers provided', () => {
    const enhancer: redux.StoreEnhancer = next => next;
    const reducer: redux.Reducer = (state = {}) => state;

    expect(createStore({ enhancers: [enhancer], reducer })).toBeInstanceOf(
      Object
    );
    expect(redux.applyMiddleware).toHaveBeenCalled();
    expect(devtools.composeWithDevTools).toHaveBeenCalled();
    expect(redux.createStore).toHaveBeenCalledWith(
      reducer,
      undefined,
      expect.any(Function)
    );
  });
});
