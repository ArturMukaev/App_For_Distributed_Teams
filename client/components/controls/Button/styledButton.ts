import styled, {css} from "styled-components";
import {buttonType} from "../../../helpers/helper";

interface styledButtonProps {
    appearance: buttonType;
    disabled?: boolean;
}

export const StyledButton = styled.button<styledButtonProps>`
  
  font-size: 20px;
  color: white;
  padding: 5px 10px;
  border-radius: 16px;
  
  &:hover {
    cursor: pointer;
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
  }

  ${(props: styledButtonProps) =>
          props.disabled &&
          css`
            opacity: 0.6;
            &:hover{
              box-shadow: none;
              cursor: not-allowed;
            }
          `
  }
  ${(props: styledButtonProps) => {
    switch (props.appearance) {
      case 'primary':
        return 'background: grey;';
      case 'secondary':
        return 'background: blue;';
      case 'success':
        return 'background: #4CAF50;';
      case 'warning':
        return 'background: red;';
      default:
        return null;
    }
  }}

`;