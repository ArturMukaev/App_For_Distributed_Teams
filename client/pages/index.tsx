import {withLayout} from "../layout/Layout";
import React, {Suspense, useCallback, useEffect, useMemo, useState} from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import {projectRow, RoleInProject} from "../types/api/models";
import {MainPageHeader} from "../layout/header/MainPageHeader";
import {ProjectModal} from "../components/Modal/ProjectModal";
import Image from "../components/Image/Image";
import {useDispatch, useSelector} from "react-redux";
import {selectors} from "../redux/selectors";
import {useHttp} from "../hooks/useHTTP";
import {Loader} from "../components/Loader/Loader";
import {setSelectedProject, setUserProjects} from "../redux/reducers/projectReducer";
import {useRouter} from "next/router";
import styles from "../styles/Home.module.css";

function Home(): JSX.Element {

    const {request, loading} = useHttp();
    const dispatch = useDispatch();
    const router = useRouter();

    /** Selectors */
    const user = useSelector(selectors.user);
    const userProjects = useSelector(selectors.userProjects);

    /** State */
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    /** Memo */
    const sortedProjects = useMemo(():projectRow[] => {
        return userProjects.filter((item) => (
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    }, [userProjects, searchQuery]);

    /** Effect */
    useEffect(() => {
        (async () => {
            try {
                let response: projectRow[] = await request({url: `/api/project/${user.userId}`, method: "GET"});
                response = response.sort((a, b) => a.position - b.position);
                dispatch(setUserProjects(response));
            } catch (error) {
            }
        })();
    }, [user, dispatch, request]);

    /** Handlers */
    const handleDragStart = (event: React.DragEvent<HTMLTableRowElement>, index: number) => {
        setDraggedIndex(index);
        event.dataTransfer.setData("text/plain", index.toString());
    };

    const handleDragOver = (event: React.DragEvent<HTMLTableRowElement>, index: number) => {
        event.preventDefault();
        setDraggingIndex(index);
    };

    const handleDrop = async () => {
        if (draggedIndex !== draggingIndex && draggedIndex !== null && draggingIndex !== null) {
            let updatedTableData = [...userProjects];
            const draggedRow = updatedTableData[draggedIndex];
            updatedTableData.splice(draggedIndex, 1);
            updatedTableData.splice(draggingIndex, 0, draggedRow);
            updatedTableData = updatedTableData.map((element, index) => ({...element, position: index}));
            dispatch(setUserProjects(updatedTableData));
            try {
                const updatedPositions = updatedTableData.map((element) => element.id);
                await request({
                    url: '/api/project/positions',
                    method: "POST",
                    body: {posArray: updatedPositions, user: user.userId}
                });
            } catch (e) {
            }
        }
        setDraggingIndex(null);
    };

    const handleOpenProject = useCallback(
        async (project: projectRow) => {
            dispatch(setSelectedProject(project));
            if (project.role === RoleInProject.Customer) {
                await router.push(`/projects/${project.id}/client`);
            } else {
                await router.push(`/projects/${project.id}`);
            }
        }, [dispatch, router]);

    const handleCreateProject = useCallback(() => {
        setModalOpen(true);
    }, []);

    return (
        <>
            <MainPageHeader createProject={handleCreateProject} queryValue={searchQuery} setSearchQuery={setSearchQuery}/>
            <Suspense fallback={<Loader/>}>
                <ProjectModal
                    isOpen={modalOpen}
                    closeModal={() => setModalOpen(false)}
                />
            </Suspense>
            {loading ?
                <Loader/>
                :
                <Table striped bordered variant="dark" responsive className={styles.table}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Наименование</th>
                        <th>Описание</th>
                        <th>Руководитель</th>
                        <th>Ваша роль</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedProjects.map((row, index) => (
                        <tr
                            key={row.id}
                            draggable={!searchQuery}
                            onDragStart={(event) => handleDragStart(event, index)}
                            onDragOver={(event) => handleDragOver(event, index)}
                            onDrop={handleDrop}
                            style={{backgroundColor: index === draggingIndex ? "lightgray" : "white"}}
                        >
                            <td>{index + 1}</td>
                            <td>
                                <div className={styles.name}>
                                    <Image src={row.imageSrc}/>
                                    <div>{row.name}</div>
                                </div>
                            </td>
                            <td>
                                <div className={styles.description}>{row.description}</div>
                            </td>
                            <td>{row.leader}</td>
                            <td>{row.role}</td>
                            <td>
                                <Button variant="outline-light" size="sm" onClick={() => handleOpenProject(row)}>
                                    Открыть
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            }
        </>
    );
}

export default withLayout(Home, true);




