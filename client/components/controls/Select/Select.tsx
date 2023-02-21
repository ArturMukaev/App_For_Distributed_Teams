import React, {DetailedHTMLProps, SelectHTMLAttributes} from 'react';
import {StyledSelect} from "./styledSelect";



interface SelectProps extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {

}

export const Select = ({...props}: SelectProps): JSX.Element => {
    return (
        <StyledSelect {...props}>

        </StyledSelect>
    );
};