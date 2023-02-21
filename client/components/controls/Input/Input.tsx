import React, {DetailedHTMLProps, InputHTMLAttributes} from 'react';
import {StyledInput} from "./styledInput";
import {ControlContainer} from "../../../helpers/containers";


interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    labelText: string;
}

export const Input = ({labelText, ...props}: InputProps): JSX.Element => {
    return (
        <ControlContainer>
            <label>{labelText}</label>
            <StyledInput {...props}>

            </StyledInput>
        </ControlContainer>
    );
};