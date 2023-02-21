import {ReactNode} from "react";

export interface LayoutProps {
    children: ReactNode;
}

export interface authProps {
    children: any;
    redirectUrl: string;
    redirectHandler: (
        __isLoading: boolean,
        __isAuthenticated: boolean,
        __redirectUrl: string
    ) => boolean;
}