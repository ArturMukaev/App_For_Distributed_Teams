import '../styles/globals.css'
import Head from 'next/head';
import Router from 'next/router';
import React from 'react';
import type { AppProps } from "next/app";
import {wrapper} from "../redux/store";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NonSSRWrapper from "../helpers/NonSSRWrapper";

export const notify = (text: string) => toast.success(text, {
  position: "bottom-center",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <NonSSRWrapper>
    <Head>
      <title>App for distributed teams</title>
      <link rel="icon" href="/favicon.ico" />
      <meta property="og:locale" content="ru_RU" />
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
