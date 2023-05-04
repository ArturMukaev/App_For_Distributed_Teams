import React, {useCallback, useEffect, useMemo, useState} from "react";
import {withLayout} from "../../../../layout/Layout";
import {Loader} from "../../../../components/Loader/Loader";
import {useHttp} from "../../../../hooks/useHTTP";
import {useDispatch, useSelector} from "react-redux";
import {Col, Form, Row, Container} from "react-bootstrap";
import {taskType, StateOfWI} from "../../../../types/api/models";
import {selectors} from "../../../../redux/selectors";
import {featureWithTask} from "../../../../types/state/items";
import {setTasks} from "../../../../redux/reducers/itemsReducer";
import {sortTasks} from "../../../../helpers/helper";
import FeatureCard from "../../../../components/Card/FeatureCard";
import Modal from "react-modal";
import TaskForm from "../../../../components/Form/TaskForm";
import TaskCard from "../../../../components/Card/TaskCard";

import styles from "../../../../styles/Board.module.css";

const customStyles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: "20px",
        color: "white",
        backgroundColor: "#333333",
        border: "2px solid #999999",
        width: "450px",
    },
};


const Board = (): JSX.Element => {
    const {request, loading} = useHttp();
    const dispatch = useDispatch();

    /** Selectors */
    const selectedProject = useSelector(selectors.selectedProject);
    const currentUser = useSelector(selectors.user);
    const featuresWithTasks = useSelector(selectors.tasks);

    /** Memo */
    const initialData = useMemo((): taskType => ({
        name: '',
        description: '',
        state: StateOfWI.Proposed,
        id: '',
        responsible: currentUser.userId || '',
        time: 0,
    }), [currentUser]);

    /** State */
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [creationMode, setCreationMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<taskType>(initialData);
    const [sprint, setSprint] = useState<number>(selectedProject?.sprint || 0);

    /** Effect */
    useEffect(() => {
        (async () => {
            if (!selectedProject) return;
            try {
                const response: featureWithTask[] = await request({
                    url: `/api/task/${selectedProject?.id}_${sprint}`,
                    method: "GET"
                });
                dispatch(setTasks(response));
            } catch (error) {
            }
        })();
    }, [selectedProject, sprint, dispatch, request]);

    /** Handler */
    const handleSprintChange = useCallback((event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
        if (Number(event.target.value) < 1) return;
        setSprint(Number(event.target.value));
    }, []);

    const handleOpenTask = useCallback((row: taskType): void => {
        setFormData(row);
        setCreationMode(false);
        setModalOpen(true);
    }, []);

    const handleCreateTask = useCallback((feature: string): void => {
        setFormData({...initialData, feature});
        setCreationMode(true);
        setModalOpen(true);
    }, [initialData]);

    if (loading) return <Loader/>;
    return (
        <>
            <Row className={styles.row}>
                <Col className="d-flex align-items-center justify-content-start">
                    <Form.Label className="my-0">
                        Спринт:
                    </Form.Label>
                </Col>
                <Col className="me-5">
                    <Form.Control
                        type="number"
                        name="sprint"
                        value={sprint}
                        onChange={handleSprintChange}
                    />
                </Col>
            </Row>
            {featuresWithTasks.length === 0 ?
                <Container className="mt-5 text-center"><h1>В данном спринте требований не запланировано</h1>
                </Container>
                :
                <table className={styles.table}>
                    <thead>
                    <tr className={styles.header}>
                        <th>Требование</th>
                        <th>{StateOfWI.Proposed}</th>
                        <th>{StateOfWI.Active}</th>
                        <th>{StateOfWI.Resolved}</th>
                        <th>{StateOfWI.Closed}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {featuresWithTasks.map((featureWithTasks) => (
                        <tr key={featureWithTasks.id}>
                            <td>
                                <div className={styles.feature}>
                                    <FeatureCard name={featureWithTasks.name} state={featureWithTasks.state}
                                                 addTask={handleCreateTask} type={featureWithTasks.type}
                                                 id={featureWithTasks.id}/>
                                </div>
                            </td>
                            <td>
                                <div className={styles.state}>
                                    {sortTasks(featureWithTasks.tasks)[StateOfWI.Proposed].map((task) => (
                                        <TaskCard key={task.id} task={task} openTask={handleOpenTask}/>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <div className={styles.state}>
                                    {sortTasks(featureWithTasks.tasks)[StateOfWI.Active].map((task) => (
                                        <TaskCard key={task.id} task={task} openTask={handleOpenTask}/>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <div className={styles.state}>
                                    {sortTasks(featureWithTasks.tasks)[StateOfWI.Resolved].map((task) => (
                                        <TaskCard key={task.id} task={task} openTask={handleOpenTask}/>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <div className={styles.state}>
                                    {sortTasks(featureWithTasks.tasks)[StateOfWI.Closed].map((task) => (
                                        <TaskCard key={task.id} task={task} openTask={handleOpenTask}/>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            }
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Task Modal"
            >
                <TaskForm styles={styles} isCreation={creationMode} initialTaskData={formData}
                          closeModal={() => setModalOpen(false)}/>
            </Modal>
        </>
    );
};

export default withLayout(Board, false, true);