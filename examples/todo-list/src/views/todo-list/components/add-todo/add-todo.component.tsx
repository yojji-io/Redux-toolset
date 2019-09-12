import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
    Wrapper,
    InputWrapper,
    ButtonWrapper,
} from './add-todo.styles';

import Input from '../../../../components/input';
import Button from '../../../../components/button';

import {
    addTodo,
} from '../../../../core/modules/todos/todos.actions';

export default function AddTodo() {
    const dispatch = useDispatch();
    const [newTodo, setNewTodo] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodo(e.target.value);
    };

    const handleClick = () => {
        if (!newTodo.trim().length) {
            return;
        }

        setNewTodo('');
        dispatch(addTodo(newTodo));
    };

    return (
        <Wrapper>
            <InputWrapper>
                <Input
                    onChange={handleChange}
                    value={newTodo}
                    placeholder='New todo'
                />
            </InputWrapper>
            <ButtonWrapper>
                <Button
                    onClick={handleClick}
                >
                    Add
                </Button>
            </ButtonWrapper>
        </Wrapper>
    );
}
