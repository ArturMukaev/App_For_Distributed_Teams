import React from 'react';
import styled, {keyframes} from 'styled-components';
import Container from "react-bootstrap/Container";

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderIcon = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;

  &:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #348578;
    border-color: #348578 transparent #348578 transparent;
    animation: ${rotate} 1.2s linear infinite;
  }
`;

export const Loader = () =>
    <Container fluid className="d-flex justify-content-center align-items-center">
        <LoaderIcon/>
    </Container>