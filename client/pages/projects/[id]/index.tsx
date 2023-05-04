import React, {useCallback, useMemo} from 'react';
import {withLayout} from "../../../layout/Layout";
import {Col, Row} from "react-bootstrap";
import {RoleInProject} from "../../../types/api/models";
import {useHttp} from "../../../hooks/useHTTP";
import {useDispatch, useSelector} from "react-redux";
import {selectors} from "../../../redux/selectors";
import {Loader} from "../../../components/Loader/Loader";
import ProjectForm, {projectPartial} from "../../../components/Form/ProjectForm";
import {setSelectedProject} from "../../../redux/reducers/projectReducer";
import _ from "lodash";
import {notify} from "../../../helpers/helper";
import EpicTable from "../../../components/Table/EpicTable";
import styles from "../../../styles/ProjectPage.module.css";

const ProjectInfo = (): JSX.Element => {
    const {request, loading} = useHttp();
    const dispatch = useDispatch();

    /** Selectors */
    const selectedProject = useSelector(selectors.selectedProject);
    const epics = useSelector(selectors.epics);
    const user = useSelector(selectors.user);
    const isUserLeader = selectedProject?.role === RoleInProject.Leader;

    /** Memo */
    const initialData = useMemo((): projectPartial => ({
        name: selectedProject?.name || '',
        description: selectedProject?.description || '',
        imageSrc: selectedProject?.imageSrc || '',
        leader: selectedProject?.leader || '',
        leaderId: selectedProject?.leaderId || '',
        sprint: selectedProject?.sprint || 1,
    }), [selectedProject]);

    /** Handler */
    const handleUpdateProject = useCallback(async (data: projectPartial, file: File | null): Promise<void> => {
        if (_.isEqual(initialData, data)) {
            notify("Изменений нет", true);
            return;
        }
        try {
            let imageSrc = data.imageSrc;
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                const {imageUrl} = await request({
                    url: '/api/upload/image',
                    method: "POST",
                    body: formData,
                    file: true,
                });
                imageSrc = imageUrl;
            }
            const {role} = await request({
                url: '/api/project/update',
                method: "POST",
                body: {...data, imageSrc, id: selectedProject?.id, userId: user.userId}
            });
            dispatch(setSelectedProject({
                ...data,
                imageSrc,
                id: selectedProject?.id || '',
                role,
                position: selectedProject?.position || 0,
            }));
        } catch (error) {
        }
    }, [request, dispatch, selectedProject, initialData, user]);

    if (loading) return <Loader/>;
    return (
        <>
            <Row className={styles.container}>
                <Col className={styles.form_container}>
                    <ProjectForm
                        styles={styles}
                        isCreation={false}
                        initialFormData={initialData}
                        isControlsDisabled={!isUserLeader}
                        saveForm={handleUpdateProject}
                    />
                </Col>
                <Col className={styles.epic_container}>
                    <h2>Эпики</h2>
                    <EpicTable epics={epics} styles={styles}/>
                </Col>
            </Row>
        </>
    );
};

export default withLayout(ProjectInfo, false);
