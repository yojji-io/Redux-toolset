import React from 'react';
import styled from 'styled-components';

interface IInput {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | number;
    placeholder?: string;
}

const Input = styled('input')<IInput>`
  border: none;
  border-bottom: 2px solid #fff;
  outline: none;
  padding: 10px 0;
  width: 100%;
  background-color: transparent;
  color: #fff;
  text-align: center;

  &::placeholder {
    color: #fff;
    opacity: .6;
  }
`;

export default Input;
