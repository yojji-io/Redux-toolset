import { combineReducers } from 'redux';

import todos, { IInitialState as ITodos} from './modules/todos/todos.reducer';

export default combineReducers({
    todos,
});

export interface IStore {
    todos: ITodos;
}
