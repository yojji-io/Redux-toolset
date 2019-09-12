import styled from 'styled-components';

export const Wrapper = styled.div`
    width: 400px;
    height: 300px;
    overflow-y: scroll;
`;

export const TodoWrapper = styled.div`
  cursor: pointer;
  margin: 20px 0;
`;

export const TodoText = styled('div')<{complete: boolean}>`
  color: #fff;
  font-size: 18px;
  ${props => props.complete && 'text-decoration: line-through'}
  ${props => props.complete && 'opacity: .7'}
`;

export const NoTodosStub = styled.div`
  color: #fff;
  font-size: 32px;
  text-align: center;
  opacity: .5;
`;
