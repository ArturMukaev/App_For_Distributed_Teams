import React, {ReactElement, useCallback, useState} from 'react';
import {Button, Form, Row, Col} from "react-bootstrap";
import {notify} from "../../helpers/helper";
import {projectRow} from "../../types/api/models";
import Image from "../Image/Image";
import {useSelector} from "react-redux";
import {selectors} from "../../redux/selectors";

interface IProps {
    styles: any,
    isCreation: boolean,
    initialFormData: projectPartial,
    isControlsDisabled: boolean,
    saveForm: (data: projectPartial, file: File | null) => Promise<void>,
    closeButton?: ReactElement,
}

export type projectPartial = Omit<projectRow, "role" | "id" | "position">;


const ProjectForm = ({
                         styles,
                         isCreation,
                         initialFormData,
                         isControlsDisabled,
                         saveForm,
                         closeButton
                     }: IProps): JSX.Element => {

    /** Selectors */
    const usersOfProject = useSelector(selectors.usersOfProject);

    /** State */
    const [data, setData] = useState<projectPartial>(initialFormData);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    /** Handler */
    const changeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>): void => {
        if (event.target.value.length > 100) {
            notify("Максимальная длина описания - 100 символов", true);
            return;
        }
        setData({...data, [event.target.name]: event.target.value});
    }, [data]);

    const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setSelectedFile(file);
        setData({...data, imageSrc: ''});
    }, [data]);

    const handleSaveForm = useCallback(async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        await saveForm(data, selectedFile);
    }, [data, selectedFile, saveForm]);

    const handleDeleteImage = useCallback(
        () => {
            setData({...data, imageSrc: ''});
        },
        [data],
    );

    return (
        <Form className={styles.main_form} encType="multipart/form-data">
            <h2 className="text-center">
                {isCreation ? "Создание проекта" : "Информация о проекте"}
            </h2>
            {closeButton && closeButton}
            <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Название</Form.Label>
                <Form.Control
                    type="text"
                    disabled={isControlsDisabled}
                    placeholder="Введите название проекта"
                    name="name"
                    value={data.name}
                    onChange={changeHandler}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Краткое описание</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    disabled={isControlsDisabled}
                    placeholder="Введите краткое описание проекта. Максимум - 100 символов"
                    name="description"
                    value={data.description}
                    onChange={changeHandler}/>
            </Form.Group>
            {data.imageSrc && <Form.Group controlId="formImage" className="mb-3">
                <Form.Label>Аватар проекта: <Image src={data.imageSrc}/></Form.Label>
                <Button variant="outline-danger" className="ms-3" disabled={isControlsDisabled}
                        onClick={handleDeleteImage}>Удалить</Button>
            </Form.Group>}
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>{isCreation ? "Выберите аватар проекта" : "Загрузить новый аватар:"}</Form.Label>
                <Form.Control type="file" name="image" disabled={isControlsDisabled} onChange={handleFileInput}/>
            </Form.Group>
            <Form.Group controlId="formLeader" className="mb-3">
                <Form.Label>Руководитель проекта</Form.Label>
                {isCreation ?
                    <Form.Control
                        type="text"
                        disabled
                        value={data.leader}
                    /> :
                    <Form.Select aria-label="select" name="leaderId" value={data.leaderId}
                                 onChange={changeHandler} disabled={isControlsDisabled}>
                        {usersOfProject.map(({id, name}) => (
                            <option value={id} key={id}>{name}</option>
                        ))}
                    </Form.Select>
                }
            </Form.Group>
            {!isCreation &&
                <Form.Group className="mb-3" controlId="formSprint">
                    <Row>
                        <Col className="d-flex align-items-center justify-content-end">
                            <Form.Label className="my-0">
                                Текущий спринт
                            </Form.Label>
                        </Col>
                        <Col>
                            <Form.Control
                                className={styles.sprint}
                                type="number"
                                disabled={isControlsDisabled}
                                name="sprint"
                                value={data.sprint}
                                onChange={changeHandler}/>
                        </Col>
                    </Row>
                </Form.Group>
            }
            <Row className="d-flex justify-content-center px-5">
                <Button variant="outline-success" type="submit" onClick={handleSaveForm}
                        disabled={isControlsDisabled}>
                    {isCreation ? "Создать" : "Сохранить изменения"}
                </Button>
            </Row>
        </Form>
    );
};

export default ProjectForm;
