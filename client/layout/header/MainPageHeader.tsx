import React, {useCallback} from "react";
import Link from 'next/link';
import {Nav, Navbar, Form, Button} from 'react-bootstrap';
import UserInfo from "./UserInfo";
import styles from "../../styles/Header.module.css";

interface IProps {
    createProject: () => void;
    setSearchQuery: (query: string) => void;
    queryValue: string;
}

export const MainPageHeader = ({ createProject, queryValue, setSearchQuery }: IProps): JSX.Element => {

    const handleQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
        setSearchQuery(event.target.value);
    }, [setSearchQuery]);

    return (
        <Navbar expand="lg" variant="dark" className={styles.navbar}>
            <Navbar.Brand className={styles.title}><Link href="/">Artik</Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto">
                    <div className={styles.controls}>
                        <Button variant="outline-light" onClick={createProject}>Создать проект</Button>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Поиск по наименованию"
                                className="me-2"
                                aria-label="Search"
                                value={queryValue}
                                onChange={handleQueryChange}
                            />
                        </Form>
                    </div>
                </Nav>
                <UserInfo/>
            </Navbar.Collapse>
        </Navbar>
    )
}