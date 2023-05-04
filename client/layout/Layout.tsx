import React, {FC, ReactNode} from "react";
import {Footer} from "./footer/Footer";
import {Header} from "./header/Header";
import {StyledBody, StyledLayout} from "./styled";
import {useRouter} from "next/router";
import {Loader} from "../components/Loader/Loader";
import {useSelector} from "react-redux";
import {selectors} from "../redux/selectors";

interface LayoutProps {
    children: ReactNode;
    customHeader: boolean;
    fullPage?: boolean;
}

const Layout = ({children, customHeader, fullPage}: LayoutProps): JSX.Element =>
    <StyledLayout style={{minWidth: fullPage ? "1400px" : "0"}}>
        {customHeader ? <></> : <Header/>}
        <StyledBody>
            {children}
        </StyledBody>
        <Footer/>
    </StyledLayout>;


export const withLayout = <T extends Record<string, unknown>>(Component: FC<T>, customHeader: boolean, fullPage?: boolean) => {
    return function withLayoutComponent(props: T): JSX.Element {
        const router = useRouter();
        const isAuth = useSelector(selectors.isAuthenticated);
        if (!isAuth) {
            router.push('/login');
            return (
                <Loader/>
            );
        }
        return (
            <Layout fullPage={fullPage} customHeader={customHeader}>
                <Component {...props} />
            </Layout>
        );
    };
};