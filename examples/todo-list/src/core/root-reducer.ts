import { combineReducers } from 'redux';

import todos from './modules/todos/todos.reducer';

const store = combineReducers({
    todos,
});

export default store;

export type TStore = ReturnType<typeof store>;
