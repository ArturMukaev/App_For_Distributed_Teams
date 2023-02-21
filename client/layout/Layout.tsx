import React, {FunctionComponent} from "react";
import {LayoutProps} from "./types";
import {Footer} from "./footer/Footer";
import {Header} from "./header/Header";
import {Auth, forwardAuthenticated} from "./Auth";
import {StyledBody, StyledLayout} from "./styled";

export const Layout = ({ children } : LayoutProps) : JSX.Element =>
        <StyledLayout>
            <Auth redirectUrl="/" redirectHandler={forwardAuthenticated}>
                <Header/>
                <StyledBody>
                    {children}
                </StyledBody>
                <Footer/>
            </Auth>
        </StyledLayout>;


export const withLayout = <T extends Record<string, unknown>>(Component: FunctionComponent<T>) => {
    return function withLayoutComponent(props: T): JSX.Element {
        return (
                <Layout>
                    <Component {...props} />
                </Layout>
        );
    };
};