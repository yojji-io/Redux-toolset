import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    ITodo,
} from '../../../../core/modules/todos/todos.reducer';

import {
    selectTodosList,
} from '../../../../core/modules/todos/todos.selectors';

import {
    changeTodoStatus,
} from '../../../../core/modules/todos/todos.actions';

import {
    Wrapper,
    TodoWrapper,
    TodoText,
    NoTodosStub,
} from './list.styles';

interface ITodoComponent extends ITodo {
    onTodoClick: (id: number) => void;
}

const Todo = ({ id, text, complete, onTodoClick }: ITodoComponent) => (
    <TodoWrapper onClick={() => onTodoClick(id)}>
        <TodoText complete={complete}>
            {text}
        </TodoText>
    </TodoWrapper>
);

export default function TodoList() {
    const dispatch = useDispatch();
    const todos = useSelector(selectTodosList);

    const handleChangeTodoStatus = (id: number) => {
        dispatch(changeTodoStatus(id));
    };

    return (
        <Wrapper>
            {todos.length
                ? todos.map(todo => <Todo
                    {...todo}
                    key={todo.id}
                    onTodoClick={handleChangeTodoStatus}
                />)
                : <NoTodosStub>No todos</NoTodosStub>}
        </Wrapper>
    );
}
