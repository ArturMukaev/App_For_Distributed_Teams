import React from "react";
import Link from 'next/link';
import {useAuth} from "../../hooks/useAuth";
import {StyledHeader} from "./styledHeader";

export const Header = () : JSX.Element => {
    const { logoutFrom } = useAuth();

    const logoutHandler = (event: React.MouseEvent) =>{
        event.preventDefault();
        logoutFrom();
    }

    return(
        <>
            <StyledHeader>
                    <span>TeamWork</span>
                    <ul>
                        <li><Link href="/board"><a>Доска задач</a></Link></li>
                        <li><Link href="/backlog"><a>Бэклог</a></Link></li>
                        <li><Link href="/"><a onClick={logoutHandler}>Выйти</a></Link></li>
                    </ul>
            </StyledHeader>
        </>
    )
}