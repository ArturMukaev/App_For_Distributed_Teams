import React, {useCallback, useState} from 'react';
import {Button, Col, Form, Row, CloseButton} from "react-bootstrap";
import {notify} from "../../helpers/helper";
import {FeatureType, featureType, Priority} from "../../types/api/models";
import StateSelect from "../Control/Select/StateSelect";
import {useHttp} from "../../hooks/useHTTP";
import {useDispatch, useSelector} from "react-redux";
import {Loader} from "../Loader/Loader";
import {addFeature, updateFeature} from "../../redux/reducers/itemsReducer";
import {selectors} from "../../redux/selectors";
import _ from "lodash";

interface IProps {
    styles: any,
    initialFeatureData: featureType,
    isCreation: boolean,
    closeModal: () => void;
}

const FeatureForm = ({styles, initialFeatureData, isCreation, closeModal}: IProps): JSX.Element => {
    const {request, loading} = useHttp();
    const dispatch = useDispatch();

    /** Selectors */
    const selectedProject = useSelector(selectors.selectedProject);
    const epics = useSelector(selectors.epics);

    /** State */
    const [data, setData] = useState<featureType>(initialFeatureData);

    /** Handler */
    const changeTextHandler = useCallback((event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>): void => {
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

    const handleDeleteFeature = useCallback(async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        notify("Функционал в разработке", true);
    }, []);

    const handleSaveForm = useCallback(async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        if (!isCreation && _.isEqual(initialFeatureData, data)) {
            notify("Изменений нет", true);
            return;
        }
        if (data.epicId === '') {
            notify("Перед добавлением требований, добавьте в проект эпик", true);
            return;
        }
        try {
            const {id} = await request({
                url: '/api/feature/add',
                method: "POST",
                body: {...data, project: selectedProject?.id}
            });
            if (id) {
                dispatch(addFeature({...data, id}));
            } else {
                dispatch(updateFeature(data));
            }
            closeModal();
        } catch (e) {
        }
    }, [data, selectedProject, isCreation, dispatch, request, closeModal, initialFeatureData]);

    if (loading) return <Loader/>;

    return (
        <Form className={styles.feature_form}>
            <h2
                className="text-center"
                style={{color: data.type === FeatureType.Bug ? "#dc3545" : "#0dcaf0"}}
            >{data.type}</h2>
            <CloseButton className={styles.close} variant="white" onClick={closeModal}/>
            <Row>
                <Col>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Название</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите название"
                            name="name"
                            value={data.name}
                            onChange={changeTextHandler}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={7}
                            placeholder="Введите описание. Максимум - 1000 символов"
                            name="description"
                            value={data.description}
                            onChange={changeTextHandler}/>
                    </Form.Group>
                    <Form.Group controlId="formState" className="mb-3">
                        <Form.Label>Статус</Form.Label>
                        {isCreation ? <Form.Control
                                type="text"
                                disabled
                                value={data.state}
                            /> :
                            <StateSelect value={data.state} onChange={changeTextHandler}/>
                        }
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" controlId="formSprint">
                        <Row>
                            <Col className="d-flex align-items-center justify-content-end">
                                <Form.Label className="my-0">
                                    Номер спринта:
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    className={styles.numberInput}
                                    type="number"
                                    name="sprintNumber"
                                    value={data.sprintNumber}
                                    onChange={changeNumberHandler}/>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formMark">
                        <Form.Label>Оценка трудоемкости по 3 точкам:</Form.Label>
                        <Row className="mb-1">
                            <Col className="d-flex align-items-center justify-content-end">
                                <Form.Label className="my-0">
                                    Минимальная оценка:
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    className={styles.numberInput}
                                    type="number"
                                    name="minMark"
                                    value={data.minMark}
                                    onChange={changeNumberHandler}/>
                            </Col>
                        </Row>
                        <Row className="mb-1">
                            <Col className="d-flex align-items-center justify-content-end">
                                <Form.Label className="my-0">
                                    Наиболее вероятная оценка:
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    className={styles.numberInput}
                                    type="number"
                                    name="mark"
                                    value={data.mark}
                                    onChange={changeNumberHandler}/>
                            </Col>
                        </Row>
                        <Row className="mb-1">
                            <Col className="d-flex align-items-center justify-content-end">
                                <Form.Label className="my-0">
                                    Максимальная оценка:
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    className={styles.numberInput}
                                    type="number"
                                    name="maxMark"
                                    value={data.maxMark}
                                    onChange={changeNumberHandler}/>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="formPriority">
                        <Form.Label>Приоритет:</Form.Label>
                        <Form.Select aria-label="select" name="priority" value={data.priority} onChange={changeTextHandler}>
                            <option value={Priority.Low}>{Priority.Low}</option>
                            <option value={Priority.Medium}>{Priority.Medium}</option>
                            <option value={Priority.High}>{Priority.High}</option>
                            <option value={Priority.Critical}>{Priority.Critical}</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPriority">
                        <Form.Label>Эпик-родитель:</Form.Label>
                        <Form.Select aria-label="select" name="epicId" value={data.epicId}
                                     onChange={changeTextHandler}>
                            {epics.map(({id, name}) => (
                                <option value={id} key={id}>{name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <Button variant="outline-success" type="submit" onClick={handleSaveForm}>
                                {isCreation ? "Создать" : "Сохранить изменения"}
                            </Button>
                        </Col>
                        {!isCreation &&
                            <Col className="d-flex justify-content-center">
                                <Button variant="outline-danger" onClick={handleDeleteFeature}>
                                    Удалить
                                </Button>
                            </Col>
                        }
                    </Row>
                </Col>
            </Row>
        </Form>
    );
};

export default FeatureForm;