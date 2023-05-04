import React, {useCallback, useState} from 'react';
import {Button, Col, Form, Row, CloseButton} from "react-bootstrap";
import {notify} from "../../helpers/helper";
import {RoleInProject, taskType} from "../../types/api/models";
import StateSelect from "../Control/Select/StateSelect";
import {useHttp} from "../../hooks/useHTTP";
import {useDispatch, useSelector} from "react-redux";
import {Loader} from "../Loader/Loader";
import {addTask, updateTask} from "../../redux/reducers/itemsReducer";
import {selectors} from "../../redux/selectors";
import _ from "lodash";

interface IProps {
    styles: any,
    initialTaskData: taskType,
    isCreation: boolean,
    closeModal: () => void;
}

const TaskForm = ({styles, isCreation, initialTaskData, closeModal}: IProps): JSX.Element => {
    const {request, loading} = useHttp();
    const dispatch = useDispatch();

    /** Selectors */
    const users = useSelector(selectors.usersOfProject).filter((user) => user.role !== RoleInProject.Customer);

    /** State */
    const [data, setData] = useState<taskType>(initialTaskData);

    /** Handler */
    const changeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>): void => {
        if (event.target.value.length > 1000) {
            notify("Максимальная длина описания - 1000 символов", true);
            return;
        }
        setData({...data, [event.target.name]: event.target.value});
    }, [data]);

    const changeNumberHandler = useCallback((event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>): void => {
        if (Number(event.target.value) < 0) {
            return;
        }
        setData({...data, [event.target.name]: Number(event.target.value)});
    }, [data]);

    const handleDeleteTask = useCallback(async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        notify("Функционал в разработке", true);
    }, []);

    const handleSaveForm = useCallback(async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        if (!isCreation && _.isEqual(initialTaskData, data)) {
            notify("Изменений нет", true);
            return;
        }
        try {
            const {id} = await request({url: '/api/task/add', method: "POST", body: data,});
            if (id) {
                dispatch(addTask({...data, id}));
            } else {
                dispatch(updateTask(data));
            }
            closeModal();
        } catch (e) {
        }
    }, [data, isCreation, dispatch, request, closeModal, initialTaskData]);

    if (loading) return <Loader/>;

    return (
        <Form className={styles.task_form}>
            <h2 className="text-center">
                {isCreation ? "Создание задачи" : "Информация о задаче"}
            </h2>
            <CloseButton className={styles.close} variant="white" onClick={closeModal}/>
            <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Название</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Введите название задачи"
                    name="name"
                    value={data.name}
                    onChange={changeHandler}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Описание</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={7}
                    placeholder="Введите описание задачи. Максимум - 1000 символов"
                    name="description"
                    value={data.description}
                    onChange={changeHandler}/>
            </Form.Group>
            <Row>
                <Col>
                    <Form.Group controlId="formState" className="mb-3">
                        <Form.Label>Статус задачи</Form.Label>
                        {isCreation ? <Form.Control
                                type="text"
                                disabled
                                value={data.state}
                            /> :
                            <StateSelect value={data.state} onChange={changeHandler}/>
                        }
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Ответственный</Form.Label>
                        <Form.Select aria-label="select" name="responsible" value={data.responsible}
                                     onChange={changeHandler}>
                            {users.map(({id, name}) => (
                                <option value={id} key={id}>{name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            {!isCreation &&
                <Form.Group className="mb-3" controlId="formSprint">
                    <Row>
                        <Col className="d-flex align-items-center justify-content-end">
                            <Form.Label className="my-0 text-end">
                                Потраченное время:
                            </Form.Label>
                        </Col>
                        <Col>
                            <Form.Control
                                className={styles.numberInput}
                                type="number"
                                name="time"
                                value={data.time}
                                onChange={changeNumberHandler}/>
                        </Col>
                    </Row>
                </Form.Group>
            }
            <Row>
                <Col className="d-flex justify-content-center">
                    <Button variant="outline-success" type="submit" onClick={handleSaveForm}>
                        {isCreation ? "Создать" : "Сохранить изменения"}
                    </Button>
                </Col>
                {!isCreation &&
                    <Col className="d-flex justify-content-center">
                        <Button variant="outline-danger" onClick={handleDeleteTask}>
                            Удалить
                        </Button>
                    </Col>
                }
            </Row>
        </Form>
    );
};

export default TaskForm;