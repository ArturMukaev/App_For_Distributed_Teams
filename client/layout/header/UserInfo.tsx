import React, {useCallback} from 'react';
import {NavDropdown, Nav} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../redux/reducers/authReducer";
import styles from "../../styles/Header.module.css";
import {selectors} from "../../redux/selectors";
import {notify} from "../../helpers/helper";

const UserInfo = (): JSX.Element => {
    const dispatch = useDispatch();
    const userName = useSelector(selectors.userName);

    const logoutHandler = (event: React.MouseEvent) =>{
        event.preventDefault();
        dispatch(logout());
    }

    const handleOpenSettings = useCallback(() => {
        notify("Функционал в разработке", true);
    }, []);

    return (
        <Nav className={styles.dropdown}>
            <NavDropdown title={userName} id="user_info">
                <NavDropdown.Item onClick={handleOpenSettings}>Настройки</NavDropdown.Item>
                <NavDropdown.Item onClick={logoutHandler}>Выйти</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    );
};

export default UserInfo;
