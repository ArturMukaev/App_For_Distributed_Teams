import Head from 'next/head';
import Image from 'next/image';
import {withLayout} from "../layout/Layout";
import React from "react";
import {CenterContainer} from "../helpers/containers";
import {Input} from "../components/controls/Input/Input";

function Home(): JSX.Element {
    return (
        <CenterContainer>
            <Input labelText="Логин"/>
        </CenterContainer>
    );
}

export default withLayout(Home);




