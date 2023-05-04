import Head from 'next/head';
import React, {useEffect} from 'react';
import type {AppProps} from "next/app";
import {wrapper} from "../redux/store";
import {ToastContainer} from 'react-toastify';
import NonSSRWrapper from "../helpers/NonSSRWrapper";
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import {storageName, storageProjectInfo} from "../helpers/helper";
import {useDispatch} from "react-redux";
import {login} from "../redux/reducers/authReducer";
import {setSelectedProject} from "../redux/reducers/projectReducer";

function MyApp({Component, pageProps}: AppProps): JSX.Element {

    const dispatch = useDispatch();
    /** Effect */
    // Логинимся, если в локальном хранилище есть токен
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName) as string);
        const projectData = JSON.parse(localStorage.getItem(storageProjectInfo) as string);
        if(data?.token){
            dispatch(login(data));
        }
        if (projectData?.id) {
            dispatch(setSelectedProject(projectData));
        }
    }, [dispatch]);

    return <NonSSRWrapper>
        <Head>
            <title>Artik</title>
            <link rel="icon" href="/favicon.ico"/>
            <meta property="og:locale" content="ru_RU"/>
        </Head>
        <ToastContainer
            position="bottom-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
        />
        <Component {...pageProps} />
    </NonSSRWrapper>;
}

export default wrapper.withRedux(MyApp);
