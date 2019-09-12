import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    getTodos,
} from '../../core/modules/todos/todos.actions';

import {
    selectIsLoading,
} from '../../core/modules/todos/todos.selectors';

import SpinnerComponent from '../../components/spinner';

import Todos from './components/list';
import AddTodo from './components/add-todo';

import {
    Wrapper,
    Title,
    SpinnerWrapper,
} from './todo-list.styles';

const Spinner = () => (
    <SpinnerWrapper>
        <SpinnerComponent size={20} />
    </SpinnerWrapper>
);

export default function TodoList() {
    const dispatch = useDispatch();

    const isLoading = useSelector(selectIsLoading);

    useEffect(() => {
        dispatch(getTodos());
    }, []);

    return (
        <Wrapper>
            <Title>todos.</Title>
            <AddTodo />
            {isLoading
                ? <Spinner />
                : <Todos />
            }
        </Wrapper>
    );
}
