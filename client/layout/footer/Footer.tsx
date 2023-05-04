import React from "react";
import {StyledFooter} from "./styledFooter";
import { format } from 'date-fns';

export const Footer = () : JSX.Element => {
    return (
        <StyledFooter>
            <span>Информационная система управления проектами "Artik". Версия: 1.0</span>
            <span>Мукаев Артур © 2020 - {format(new Date(), 'yyyy')} Все права защищены </span>
        </StyledFooter>
    )
}