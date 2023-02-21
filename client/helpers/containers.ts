import styled from 'styled-components';

export const CenterContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const ControlContainer = styled.div`
  display: grid;
  width: 100%;
  height: 80px;
  grid-template-rows: 1fr 3fr;
  gap: 10px 0;
  label {
    font-size: 16px;
  }
  
`;