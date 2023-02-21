import styled from "styled-components";

export const StyledLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 1fr);
  grid-template-rows: auto 1fr auto;

  min-height: 100vh;
  gap: 10px;
  grid-template-areas:
      "header"
      "body"
      "footer";
`;

export const StyledBody = styled.div`
  grid-area: body;
`;

export const StyledBacklog = styled.table`
  th,td {
    text-align: center;
    border-left: 6px solid green;
  }
  tr+th, tr+td{
    border: none;
  }
`;