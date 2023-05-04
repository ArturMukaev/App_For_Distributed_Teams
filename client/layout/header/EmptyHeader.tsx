import React from "react";
import Link from 'next/link';
import {Navbar} from 'react-bootstrap';
import UserInfo from "./UserInfo";
import styles from "../../styles/Header.module.css";

export const EmptyHeader = (): JSX.Element => (
    <Navbar expand="lg" variant="dark" className={styles.navbar}>
        <Navbar.Brand className={styles.title}><Link href="/">Artik</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
            <UserInfo/>
        </Navbar.Collapse>
    </Navbar>
);