import React, {useEffect} from "react";
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {useRouter} from "next/router";
import UserInfo from "./UserInfo";
import {Loader} from "../../components/Loader/Loader";
import {batch, useDispatch, useSelector} from "react-redux";
import {selectors} from "../../redux/selectors";
import useDidMountEffect from "../../hooks/useDidMountEffect";
import {userModel, workItemType} from "../../types/api/models";
import {setProjectUsers} from "../../redux/reducers/projectReducer";
import {useHttp} from "../../hooks/useHTTP";
import {setEpics} from "../../redux/reducers/itemsReducer";
import styles from "../../styles/Header.module.css";

export const Header = (): JSX.Element => {
    const {query: {id}, push} = useRouter();
    const selectedProject = useSelector(selectors.selectedProject);
    const {request} = useHttp();
    const dispatch = useDispatch();


    /** Effect */
    useEffect(() => {
        (async () => {
            if (!selectedProject) {
                push('/');
                return (
                    <Loader/>
                );
            }
            try {
                let responseUsers: userModel[] = await request({
                    url: `/api/project/users/${selectedProject.id}`,
                    method: "GET"
                });
                let responseEpics: workItemType[] = await request({
                    url: `/api/epic/${selectedProject?.id}`,
                    method: "GET"
                });
                batch(() => {
                    dispatch(setEpics(responseEpics));
                    dispatch(setProjectUsers(responseUsers));
                })
            } catch (error) {
            }
        })();
    }, [selectedProject]);

    useDidMountEffect(() => {
        if (id !== selectedProject?.id) {
            push('/');
            return (
                <Loader/>
            );
        }
    }, [selectedProject]);

    return (
        <Navbar expand="lg" variant="dark" className={styles.navbar}>
            <Navbar.Brand className={styles.title}><Link href="/">Artik</Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className={styles.nav}><Link href={`/projects/${selectedProject?.id}`}>Главная</Link></Nav>
                <Nav className={styles.nav}><Link href={`/projects/${selectedProject?.id}/board`}>Доска
                    задач</Link></Nav>
                <Nav className={styles.nav}><Link href={`/projects/${selectedProject?.id}/backlog`}>Бэклог</Link></Nav>
                <Nav className={styles.nav}><Link href={`/projects/${selectedProject?.id}/users`}>Участники
                    проекта</Link></Nav>
                <UserInfo/>
            </Navbar.Collapse>
        </Navbar>
    )
}