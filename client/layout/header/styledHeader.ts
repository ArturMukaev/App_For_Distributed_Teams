import styled from "styled-components";

export const StyledHeader = styled.nav`
  grid-area: header;
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  color: white;
  background-color: #164d4d;
  padding: 15px 25px;
  span {
    font-size: 28px;
  }
  ul {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: auto auto auto;
  }
  li {
    font-size: 20px;
    list-style-type: none;
  }
  li:hover {
    transform: scale(1.05);
    transition-duration: 0.4s;
  }
`;