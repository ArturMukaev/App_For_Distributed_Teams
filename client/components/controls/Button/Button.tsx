import React, {ButtonHTMLAttributes, DetailedHTMLProps, ReactNode} from 'react';
import {StyledButton} from "./styledButton";
import {buttonType} from "../../../helpers/helper";


interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    children: ReactNode;
    appearance: buttonType;
    disabled?: boolean;
}

export const Button = ({appearance, children, disabled, ...props}: ButtonProps): JSX.Element => {
    return (
        <StyledButton appearance={appearance} disabled={disabled} {...props}>
            {children}
        </StyledButton>
    );
};