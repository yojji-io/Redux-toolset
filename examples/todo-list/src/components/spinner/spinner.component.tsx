import styled from 'styled-components';

interface IProps {
    color?: string;
    backgroundColor?: string;
    size: number;
}

export default styled('div')<IProps>`
  border: 8px solid #${props => props.backgroundColor || 'BAE6F7'};
  border-top: 8px solid #${props => props.color || 'DEF5FE'};
  border-radius: 50%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  animation: spin 1.5s linear infinite;

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
`;
