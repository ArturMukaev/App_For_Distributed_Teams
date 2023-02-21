import Router from "next/router";
import React, {useState, useEffect} from "react";
import {useAuth} from "../hooks/useAuth";
import {Loader} from "../components/Loader";
import {authProps} from "./types";

export const forwardAuthenticated = (
    __isLoading: boolean,
    __isAuthenticated: boolean,
    __redirectUrl: string
) => {
    if (__isAuthenticated && !__isLoading) {
        Router.push(__redirectUrl);
    }
    return !__isAuthenticated && !__isLoading;
};

export const Auth: React.FC<authProps> = ({children, redirectUrl, redirectHandler}) => {
    const { loading, isAuthenticated } = useAuth();
    const [shouldRenderChildren, setShouldRenderChildren] =
        useState<boolean>(false);

    useEffect(() => {
        setShouldRenderChildren(
            redirectHandler(loading, isAuthenticated, redirectUrl)
        );
    }, [loading, isAuthenticated]);

    if (shouldRenderChildren) {
        return <>{children}</>;
    }
    return < Loader/>;
};