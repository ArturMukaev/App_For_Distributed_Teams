import styled, {css} from "styled-components";

interface styledInputProps {

}

export const StyledInput = styled.input<styledInputProps>`
  font-size: 24px;
  border: none;
  border-bottom: 3px solid #3f3434;
  border-radius: 5px;
  outline: none;
`;