import React from "react";
import {StyledFooter} from "./styledFooter";
import { format } from 'date-fns';

export const Footer = () : JSX.Element => {
    return (
        <StyledFooter>
            <span>Мукаев Артур © 2020 - {format(new Date(), 'yyyy')} Все права защищены </span>
            <span>Проект выполнен в рамках курсовой работы на 3 курсе</span>
        </StyledFooter>
    )
}