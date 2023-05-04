import React, {useCallback} from "react";
import {Card, OverlayTrigger, Tooltip, Form} from "react-bootstrap";
import {RoleInProject, StateOfWI, taskType} from "../../types/api/models";
import {useDispatch, useSelector} from "react-redux";
import {selectors} from "../../redux/selectors";
import {useHttp} from "../../hooks/useHTTP";
import {updateTask} from "../../redux/reducers/itemsReducer";
import {Loader} from "../Loader/Loader";
import styles from "../../styles/TaskCard.module.css";

interface CardProps {
    task: taskType;
    openTask: (task: taskType) => void;
}

const TaskCard = ({task, openTask}: CardProps): JSX.Element => {
    const {request, loading} = useHttp();
    const dispatch = useDispatch();

    /** Selectors */
    const users = useSelector(selectors.usersOfProject).filter((user) => user.role !== RoleInProject.Customer);

    /** Handler */
    const changeResponsible = useCallback(async (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>): Promise<void> => {
        try {
            await request({url: '/api/task/add', method: "POST", body: {...task, responsible: event.target.value}});
            dispatch(updateTask({...task, responsible: event.target.value}));
        } catch (e) {
        }
    }, [task, dispatch, request]);

    const changeState = useCallback(async (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>): Promise<void> => {
        try {
            await request({url: '/api/task/add', method: "POST", body: {...task, state: event.target.value}});
            dispatch(updateTask({...task, state: (event.target.value as StateOfWI)}));
        } catch (e) {
        }
    }, [task, dispatch, request]);

    const changeTime = useCallback(async (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>): Promise<void> => {
        if (Number(event.target.value) < 0) {
            return;
        }
        try {
            await request({url: '/api/task/add', method: "POST", body: {...task, time: Number(event.target.value)}});
            dispatch(updateTask({...task, time: Number(event.target.value)}));
        } catch (e) {
        }
    }, [task, dispatch, request]);

    return (
        <Card className={styles.card} bg="secondary" text="dark">
            <Card.Body className={styles.body}>
                {loading ? <Loader/> :
                    <>
                        <OverlayTrigger placement="top" overlay={<Tooltip>{task.name}</Tooltip>}>
                            <Card.Title onClick={() => openTask(task)} className={styles.title}>{task.name}</Card.Title>
                        </OverlayTrigger>
                        <div className={styles.responsible}>
                            <Form.Select aria-label="select" name="responsible" size="sm" value={task.responsible}
                                         onChange={changeResponsible}
                            >
                                {users.map(({id, name}) => (
                                    <option value={id} key={id}>{name}</option>
                                ))}
                            </Form.Select>
                        </div>
                        <div className={styles.state}>
                            <Form.Select aria-label="select" name="state" value={task.state}
                                         onChange={changeState} size="sm">
                                <option value={StateOfWI.Proposed}>{StateOfWI.Proposed}</option>
                                <option value={StateOfWI.Active}>{StateOfWI.Active}</option>
                                <option value={StateOfWI.Resolved}>{StateOfWI.Resolved}</option>
                                <option value={StateOfWI.Closed}>{StateOfWI.Closed}</option>
                            </Form.Select>
                        </div>
                        <div className={styles.sprint}>
                            <span>Потрачено:</span>
                            <Form.Control
                                className={styles.numberInput}
                                type="number"
                                name="time"
                                value={task.time}
                                onChange={changeTime}
                            />
                            <span>часов</span>
                        </div>
                    </>
                }
            </Card.Body>
        </Card>
    );
};

export default TaskCard;