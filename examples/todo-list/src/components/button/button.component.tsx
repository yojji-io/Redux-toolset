import React from 'react';
import styled from 'styled-components';

interface IButton {
    children?: React.ReactNode;
    onClick: () => void;
}

const Button = styled('button')<IButton>`
  border:none;
  background-color: #6F9AAB;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 22px;
  border-radius: 20px;
  outline: none;
`;

export default Button;
