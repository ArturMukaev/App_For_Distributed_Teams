import React, {useEffect, useState} from 'react';
import {withLayout} from "../../../layout/Layout";
import {EmptyHeader} from "../../../layout/header/EmptyHeader";
import {Loader} from "../../../components/Loader/Loader";
import {useSelector} from "react-redux";
import {selectors} from "../../../redux/selectors";
import {useHttp} from "../../../hooks/useHTTP";
import {useRouter} from "next/router";
import {projectInfo} from "../../../types/api/models";
import {ProgressBar, Card, Row, Col} from 'react-bootstrap';
import Image from "../../../components/Image/Image";
import styles from "../../../styles/ClientPage.module.css";

const countPercent = (x = 0, y = 0): number => {
    return Math.floor(((x / y) * 100));
};

const ClientPage = (): JSX.Element => {
    const {push} = useRouter();
    const {request, loading} = useHttp();
    const selectedProject = useSelector(selectors.selectedProject);
    const [projectInfo, setProjectInfo] = useState<projectInfo>({});

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
                const response = await request({url: `/api/project/client/${selectedProject.id}`, method: "GET"});
                setProjectInfo(response);
            } catch (error) {
            }
        })();
    }, [selectedProject, push, request]);


    if (loading) return <Loader/>;
    return (
        <>
            <EmptyHeader/>
            <>
                <Card bg="dark" className={styles.card}>
                    <Card.Header className={styles.header}>
                        <div>
                            <div><b>Проект:</b>{` ${selectedProject?.name}`}</div>
                            <div><b>Описание:</b>{` ${selectedProject?.description}`}</div>
                            <div><b>Руководитель:</b> {` ${selectedProject?.leader}`}</div>
                        </div>
                        <Image src={selectedProject?.imageSrc as string}/>
                    </Card.Header>
                    <Card.Body className={styles.body}>
                        <Card.Title className="mb-2 text-center"><b>Статистика</b></Card.Title>
                        <Row className="pb-2 border-bottom">
                            <Col className="text-center">
                                <div className={styles.epic}>Эпики:</div>
                                <div>Завершено/Всего</div>
                                <div>{`${projectInfo.finishedEpics}/${projectInfo.totalEpics}`}</div>
                            </Col>
                            <Col className="text-center">
                                <div className={styles.feature}>Требования:</div>
                                <div>Завершено/Всего</div>
                                <div>{`${projectInfo.finishedFeatures}/${projectInfo.totalFeatures}`}</div>
                            </Col>
                            <Col className="text-center">
                                <div className={styles.bug}>Баги:</div>
                                <div>Завершено/Всего</div>
                                <div>{`${projectInfo.finishedBugs}/${projectInfo.totalBugs}`}</div>
                            </Col>
                        </Row>
                        <Row className="mt-2 pb-2 border-bottom">
                            <Col className="text-center">
                                <div>Текущий спринт:</div>
                                <div>{selectedProject?.sprint}</div>
                            </Col>
                            <Col className="text-center">
                                <div>Размер проектной команды:</div>
                                <div>{`${projectInfo.usersCount} человек`}</div>
                            </Col>
                            <Col className="text-center">
                                <div>Завершающие работы запланированы на спринт:</div>
                                <div>{projectInfo.lastSprint}</div>
                            </Col>
                        </Row>
                        <Card.Title className="mt-2 text-center"><b>Прогресс выполнения проекта исходя из оценки
                            трудозатрат</b></Card.Title>
                        <Row className="mt-2 d-flex">
                            <h3 className="mt-2 text-center">Прогресс закрытия баг:</h3>
                            <div className={styles.progress}>
                                <ProgressBar
                                    variant="danger"
                                    now={projectInfo.bugsMarks?.finished}
                                    max={projectInfo.bugsMarks?.total}
                                    label={`${countPercent(projectInfo.bugsMarks?.finished, projectInfo.bugsMarks?.total)} %`}
                                />
                            </div>
                        </Row>
                        <Row className="mt-2 d-flex">
                            <h3 className="mt-2 text-center">Прогресс выполнения требований:</h3>
                            <div className={styles.progress}>
                                <ProgressBar
                                    variant="info"
                                    now={projectInfo.featuresMarks?.finished}
                                    max={projectInfo.featuresMarks?.total}
                                    label={`${countPercent(projectInfo.featuresMarks?.finished, projectInfo.featuresMarks?.total)} %`}
                                />
                            </div>
                        </Row>
                    </Card.Body>
                </Card>
            </>
        </>
    );
};

export default withLayout(ClientPage, true);
