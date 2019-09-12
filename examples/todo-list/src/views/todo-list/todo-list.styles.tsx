import styled from 'styled-components';

export const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-image: linear-gradient(to left bottom, #6f9aab, #8ab0bf, #a6c7d4, #c2dee9, #def5fe);
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    font-family: 'Open Sans', sans-serif;
`;

export const Title = styled.div`
  font-size: 48px;
  color: #fff;
  font-weight: lighter;
  margin-bottom: 100px;
  letter-spacing: 3px;
`;

export const SpinnerWrapper = styled.div`
  margin-top: 40px;
  height: 300px;
  display: flex;
  align-items: center;
`;
