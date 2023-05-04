import React, {useCallback, useState} from 'react';
import {Button, Col, Form, Row, CloseButton} from "react-bootstrap";
import {notify} from "../../helpers/helper";
import {workItemType} from "../../types/api/models";
import StateSelect from "../Control/Select/StateSelect";
import {EpicModalProps} from "../Modal/EpicModal";
import {useHttp} from "../../hooks/useHTTP";
import {useDispatch, useSelector} from "react-redux";
import {Loader} from "../Loader/Loader";
import {addEpic, updateEpic} from "../../redux/reducers/itemsReducer";
import {selectors} from "../../redux/selectors";
import _ from "lodash";

type IProps = Omit<EpicModalProps, "isOpen">;

const EpicForm = ({styles, isCreation, initialFormData, isControlsDisabled, closeModal}: IProps): JSX.Element => {
    const {request, loading} = useHttp();
    const dispatch = useDispatch();

    /** Selectors */
    const selectedProject = useSelector(selectors.selectedProject);

    /** State */
    const [data, setData] = useState<workItemType>(initialFormData);
    const [isDelete, setIdDelete] = useState<boolean>(false);

    /** Handler */
    const changeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>): void => {
        if (event.target.value.length > 100) {
            notify("Максимальная длина описания - 100 символов", true);
            return;
        }
        setData({...data, [event.target.name]: event.target.value});
    }, [data]);

    const handleDeleteEpic = useCallback(async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        notify("Функционал в разработке", true);
    }, []);

    const handleDenyDelete = useCallback( (e: React.SyntheticEvent): void => {
        e.preventDefault();
        setIdDelete(false);
    }, []);

    const handleSaveForm = useCallback(async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        if (!isCreation && _.isEqual(initialFormData, data)) {
            notify("Изменений нет", true);
            return;
        }
        try {
            const {id} = await request({
                url: '/api/epic/add',
                method: "POST",
                body: {...data, project: selectedProject?.id}
            });
            if (id) {
                dispatch(addEpic({...data, id}));
            } else {
                dispatch(updateEpic(data));
            }
            closeModal();
        } catch (e) {
        }
    }, [data, selectedProject, isCreation, closeModal, dispatch, request, initialFormData]);

    if (loading) return <Loader/>;

    return (
        <Form className={styles.epic_form}>
            <h2 className="text-center">
                {isCreation ? "Создание эпика" : "Информация об эпике"}
            </h2>
            <CloseButton className={styles.close} variant="white" onClick={closeModal}/>
            <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Название</Form.Label>
                <Form.Control
                    type="text"
                    disabled={isControlsDisabled}
                    placeholder="Введите название эпика"
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
                    placeholder="Введите краткое описание эпика. Максимум - 100 символов"
                    name="description"
                    value={data.description}
                    onChange={changeHandler}/>
            </Form.Group>
            <Form.Group controlId="formState" className="mb-3">
                <Form.Label>Статус эпика</Form.Label>
                {isCreation ? <Form.Control
                        type="text"
                        disabled
                        value={data.state}
                    /> :
                    <StateSelect value={data.state} onChange={changeHandler} disabled={isControlsDisabled}/>
                }
            </Form.Group>
            <Row className={styles.row}>
                <Col className="d-flex justify-content-center">
                    {!isDelete ?
                        <Button variant="outline-success" type="submit" onClick={handleSaveForm}
                                disabled={isControlsDisabled}>
                            {isCreation ? "Создать" : "Сохранить"}
                        </Button>
                        :
                        <Button variant="outline-info" onClick={handleDenyDelete}
                                disabled={isControlsDisabled}>Отменить</Button>
                    }
                </Col>
                {!isCreation &&
                    <Col className="d-flex justify-content-center">
                        {!isDelete ?
                            <Button variant="outline-danger" onClick={() => setIdDelete(true)}
                                    disabled={isControlsDisabled}>Удалить</Button>
                            :
                            <Button variant="outline-danger" onClick={handleDeleteEpic}
                                    disabled={isControlsDisabled}>Подтвердить удаление</Button>
                        }
                    </Col>
                }
            </Row>
        </Form>
    );
};

export default EpicForm;