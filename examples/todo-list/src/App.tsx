import React from 'react';
import { Provider } from 'react-redux';
import { Normalize } from 'styled-normalize';

import store from './core/store';

import TodoList from './views/todo-list';

const App = () => (
  <Provider store={store}>
    <Normalize />
    <TodoList />
  </Provider>
);

export default App;
