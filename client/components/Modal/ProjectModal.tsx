import React, {ReactElement, useCallback, useMemo} from 'react';
import Modal from 'react-modal';
import {RoleInProject} from "../../types/api/models";
import {useHttp} from "../../hooks/useHTTP";
import {useDispatch, useSelector} from "react-redux";
import {addProject} from "../../redux/reducers/projectReducer";
import {Loader} from "../Loader/Loader";
import ProjectForm, {projectPartial} from "../Form/ProjectForm";
import {selectors} from "../../redux/selectors";
import {CloseButton} from "react-bootstrap";
import styles from "../../styles/ProjectModal.module.css";

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
    },
};

interface ProjectModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

export const ProjectModal = ({isOpen, closeModal}: ProjectModalProps): JSX.Element => {
    const {request, loading} = useHttp();
    const dispatch = useDispatch();

    /** Selectors */
    const user = useSelector(selectors.user);
    const userProjects = useSelector(selectors.userProjects);

    /** Memo */
    const initialData = useMemo((): projectPartial => ({
        name: '',
        description: '',
        imageSrc: '',
        leader: user.name || '',
        leaderId: user.userId || '',
    }), [user]);

    const closeButton = useMemo((): ReactElement => (
        <CloseButton className={styles.close} variant="white" onClick={closeModal} />
    ), [closeModal]);

    /** Handler */
    const handleCreateProject = useCallback(async (data: projectPartial, file: File | null): Promise<void> => {
        try {
            let imageSrc = '';
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
            const {id} = await request({
                url: '/api/project/add',
                method: "POST",
                body: {...data, leader: user.userId, imageSrc, position: userProjects.length}
            });
            dispatch(addProject({
                ...data,
                leader: user.name || '',
                leaderId: user.userId || '',
                imageSrc,
                id,
                role: RoleInProject.Leader,
                position: userProjects.length
            }));
            closeModal();
        } catch (error) {
        }
    }, [request, dispatch, userProjects, user]);


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Project Modal"
        >
            {loading ?
                <Loader/>
                :
                <ProjectForm
                    styles={styles}
                    isCreation
                    initialFormData={initialData}
                    isControlsDisabled={false}
                    saveForm={handleCreateProject}
                    closeButton={closeButton}
                />
            }
        </Modal>
    );
}