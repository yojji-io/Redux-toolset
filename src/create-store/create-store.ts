import {
  combineReducers,
  applyMiddleware,
  createStore as createReduxStore,
  Reducer,
  ReducersMapObject,
  Middleware,
  StoreEnhancer,
  Store,
} from 'redux';

import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import isPlainObject from 'lodash.isplainobject';

interface ICreateStore {
  reducer: Reducer | ReducersMapObject;
  middleware?: Middleware[];
  preloadedState?: any;
  enhancers?: StoreEnhancer[];
}

const getRootReducer = (reducer: Reducer | ReducersMapObject): Reducer => {
  if (typeof reducer === 'function') {
    return reducer;
  } else if (isPlainObject(reducer)) {
    return combineReducers(reducer);
  }
};

export const createStore = (options: ICreateStore): Store => {
  if (!options) {
    throw new Error('No options provided');
  }

  const { reducer = null, middleware = [], enhancers = [] } = options || {},
    rootReducer = getRootReducer(reducer);

  if (!reducer) {
    throw new Error(
      'Reducer must be a function or an object that can be passed to combineReducers'
    );
  }

  const middlewareEnhancer = applyMiddleware(...middleware),
    storeEnhancer = composeWithDevTools(middlewareEnhancer, ...enhancers),
    store = createReduxStore(
      rootReducer,
      options.preloadedState,
      storeEnhancer
    );

  return store;
};
