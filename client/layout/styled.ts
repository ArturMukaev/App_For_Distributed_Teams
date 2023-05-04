import styled from "styled-components";

export const StyledLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 1fr);
  grid-template-rows: auto 1fr auto;
  background-color: #610094;

  min-height: 100vh;
  grid-template-areas:
      "header"
      "body"
      "footer";
`;

export const StyledBody = styled.div`
  grid-area: body;
`;