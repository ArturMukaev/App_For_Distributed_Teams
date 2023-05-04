import React, {RefObject, useCallback, useMemo, useRef, useState} from 'react';
import {withLayout} from "../../../../layout/Layout";
import {useHttp} from "../../../../hooks/useHTTP";
import {useDispatch, useSelector} from "react-redux";
import {Loader} from "../../../../components/Loader/Loader";
import {selectors} from "../../../../redux/selectors";
import {Button, Container, Form, Table} from "react-bootstrap";
import {RoleInProject, userModel} from "../../../../types/api/models";
import {updateUsers, addUserToProject} from "../../../../redux/reducers/projectReducer";
import {notify} from "../../../../helpers/helper";

import styles from "../../../../styles/UsersList.module.css";

const UsersList = (): JSX.Element => {
    const {request, loading} = useHttp();
    const dispatch = useDispatch();

    /** Refs */
    const refs = useRef<[RefObject<HTMLSelectElement>, RefObject<HTMLSelectElement>]>([React.createRef(), React.createRef()]);

    /** Selectors */
    const userList = useSelector(selectors.usersOfProject);
    const selectedProject = useSelector(selectors.selectedProject);
    const curUser = useSelector(selectors.user);
    const isUserLeader = selectedProject?.role === RoleInProject.Leader;

    /** Memo */
    const initialState = useMemo((): { email: string, role: RoleInProject } => ({
        email: '',
        role: RoleInProject.Worker,
    }), []);

    /** State */
    const [addUserState, setAddUserState] = useState<{ email: string, role: RoleInProject }>(initialState);

    /** Handler */
    const handleUserChange = useCallback((e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>): void => {
            const {name, value} = e.target;
            setAddUserState({...addUserState, [name]: value});
        }, [addUserState],
    );

    const handleDeleteUser = useCallback(() => {
        notify("Функционал в разработке", true);
    },[]);

    const changeRole = useCallback(async (user: userModel, index: number): Promise<void> => {
        try {
            const role = refs.current[index].current?.value;
            await request({
                url: '/api/project/adduser',
                method: "POST",
                body: {email: user.email, role, project: selectedProject}
            });
            dispatch(updateUsers({...user, role: role as RoleInProject}));
        } catch (e) {
        }
    }, [selectedProject, refs, dispatch, request]);

    const addUser = useCallback(async (): Promise<void> => {
        if (userList.find((el) => el.email === addUserState.email)) {
            notify("Пользователь с данным email уже есть в проекте!", true);
            return;
        }
        try {
            const {id, name} = await request({
                url: '/api/project/adduser',
                method: "POST",
                body: {...addUserState, project: selectedProject}
            });
            dispatch(addUserToProject({...addUserState, id, name}));
            setAddUserState(initialState);
        } catch (e) {
        }
    }, [selectedProject, addUserState, userList, dispatch, initialState]);

    if (loading) return <Loader/>;
    return (
        <Container fluid className={styles.userList}>
            <h1>Список участников проекта</h1>
            <Table striped bordered variant="dark" responsive className={styles.table}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Участник</th>
                    <th>Роль в проекте</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {userList.map((user, index) => (
                    <tr key={user.id}>
                        <td>
                            {index + 1}
                        </td>
                        <td>
                            <div className={styles.name}>{user.email}</div>
                        </td>
                        <td>
                            <div className={styles.name}>{user.name}</div>
                        </td>
                        <td>
                            <div className={styles.role}>
                                <Form.Select
                                    aria-label="select"
                                    name="role"
                                    value={user.role}
                                    onChange={() => changeRole(user, index)}
                                    ref={refs.current[index]}
                                    disabled={!isUserLeader || curUser.userId === user.id}
                                >
                                    <option value={RoleInProject.Worker}>{RoleInProject.Worker}</option>
                                    <option value={RoleInProject.Customer}>{RoleInProject.Customer}</option>
                                    <option value={RoleInProject.Leader}>{RoleInProject.Leader}</option>
                                </Form.Select>
                            </div>
                        </td>
                        <td>
                            <div className={styles.last}>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={handleDeleteUser}
                                >Удалить</Button>
                            </div>
                        </td>
                    </tr>
                ))}
                {isUserLeader &&
                    <tr>
                        <td></td>
                        <td>
                            <div>
                                <Form.Control
                                    type="email"
                                    placeholder="Введите почтовый адрес"
                                    name="email"
                                    value={addUserState.email}
                                    onChange={handleUserChange}/>
                            </div>
                        </td>
                        <td></td>
                        <td>
                            <div className={styles.role}>
                                <Form.Select
                                    aria-label="select"
                                    name="role"
                                    value={addUserState.role}
                                    onChange={handleUserChange}
                                >
                                    <option value={RoleInProject.Worker}>{RoleInProject.Worker}</option>
                                    <option value={RoleInProject.Customer}>{RoleInProject.Customer}</option>
                                    <option value={RoleInProject.Leader}>{RoleInProject.Leader}</option>
                                </Form.Select>
                            </div>
                        </td>
                        <td>
                            <div className={styles.last}>
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={addUser}
                                >Добавить</Button>
                            </div>
                        </td>
                    </tr>
                }
                </tbody>
            </Table>
        </Container>
    );
};

export default withLayout(UsersList, false);
