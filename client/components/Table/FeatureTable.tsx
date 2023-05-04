import React, {useCallback, useMemo, useState} from 'react';
import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {FeatureType, featureType, Priority, PriorityMap, StateOfWI} from "../../types/api/models";
import {useSelector} from "react-redux";
import {selectors} from "../../redux/selectors";
import Modal from "react-modal";
import FeatureForm from "../Form/FeatureForm";

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
        width: "70%",
    },
};

interface IProps {
    features: featureType[],
    styles: any,
}

const FeatureTable = ({features, styles}: IProps): JSX.Element => {

    /** Selectors */
    const selectedProject = useSelector(selectors.selectedProject);
    const epics = useSelector(selectors.epics);

    /** Memo */
    const initialData = useMemo((): featureType => ({
        name: '',
        description: '',
        state: StateOfWI.Proposed,
        id: '',
        sprintNumber: selectedProject?.sprint || 0,
        mark: 0,
        minMark: 0,
        maxMark: 0,
        priority: Priority.Low,
        type: FeatureType.Feature,
        epicId: epics[0]?.id || '',
        epicName: epics[0]?.name || '',
    }), [selectedProject, epics]);

    /** State */
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [creationMode, setCreationMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<featureType>(initialData);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortByPriority, setSortByPriority] = useState<boolean>(false);
    const [filterBySprint, setFilterBySprint] = useState<boolean>(false);
    const [sprint, setSprint] = useState<number>(selectedProject?.sprint || 0);
    const [selectedEpic, setSelectedEpic] = useState<string>("");

    /** Memo */
    const sortedFeatures = useMemo((): featureType[] => {
        let filtered = features.filter((item) => (
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
            && item.epicName.includes(selectedEpic)
        ));
        if (filterBySprint) {
            filtered = filtered.filter((item) => item.sprintNumber === sprint);
        }
        if (sortByPriority) {
            filtered = filtered.sort((a, b) => PriorityMap[b.priority] - PriorityMap[a.priority]);
        }
        return filtered;
    }, [searchQuery, features, sprint, sortByPriority, selectedEpic, filterBySprint]);

    /** Handler */
    const handleQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
        setSearchQuery(event.target.value);
    }, []);

    const handleEpicChange = useCallback((event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
        setSelectedEpic(event.target.value);
    }, []);

    const handleSprintChange = useCallback((event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
        if (Number(event.target.value) < 1) return;
        setSprint(Number(event.target.value));
    }, []);

    const handleOpenFeature = useCallback((row: featureType): void => {
        setFormData(row);
        setCreationMode(false);
        setModalOpen(true);
    }, []);

    const handleCreateFeature = useCallback((type: FeatureType): void => {
        setFormData({...initialData, type});
        setCreationMode(true);
        setModalOpen(true);
    }, [initialData]);

    return (
        <Row className={styles.workspace}>
            <Col className={styles.params}>
                <Form>
                    <h3 className="text-center text-white">Параметры</h3>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="text"
                            placeholder="Поиск по названию"
                            value={searchQuery}
                            onChange={handleQueryChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Сортировать по приоритету"
                            // @ts-ignore
                            value={sortByPriority}
                            onChange={() => setSortByPriority(prevState => !prevState)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Отфильтровать по спринту"
                            // @ts-ignore
                            value={filterBySprint}
                            onChange={() => setFilterBySprint(prevState => !prevState)}
                        />
                    </Form.Group>
                    {filterBySprint &&
                        <Form.Group className="mb-3" controlId="formSprint">
                            <Row>
                                <Col className="d-flex align-items-center justify-content-start">
                                    <Form.Label className="my-0">
                                        Спринт
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
                        </Form.Group>
                    }
                    <Form.Group className="mb-3" controlId="formEpic">
                        <Form.Label>Фильтрация по эпику:</Form.Label>
                        <Form.Select aria-label="select" name="epicId" value={selectedEpic}
                                     onChange={handleEpicChange}>
                            <option value="">Не выбрано</option>
                            {epics.map(({name, id}) => (
                                <option value={name} key={id}>{name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Button variant="outline-info" className="mb-3"
                            onClick={() => handleCreateFeature(FeatureType.Feature)}>Добавить
                        требование</Button>
                    <Button variant="outline-danger"
                            onClick={() => handleCreateFeature(FeatureType.Bug)}>Добавить
                        баг</Button>
                </Form>
            </Col>
            <Col>
                <Table striped bordered variant="dark" responsive className={styles.table}>
                    <thead>
                    <tr>
                        <th>Название</th>
                        <th>Эпик</th>
                        <th>Приоритет</th>
                        <th>Статус</th>
                        <th>Трудоемкость</th>
                        <th>Задачи</th>
                        <th>Спринт</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedFeatures.map((row) => (
                        <tr key={row.id}>
                            <td>
                                <div
                                    className={styles.name}
                                    style={{color: row.type === FeatureType.Bug ? "#dc3545" : "#0dcaf0"}}
                                >{row.name}</div>
                            </td>
                            <td>
                                <div className={styles.name}>{row.epicName}</div>
                            </td>
                            <td>
                                {row.priority}
                            </td>
                            <td>
                                {row.state}
                            </td>
                            <td>
                                {Math.floor((row.minMark + 4 * row.mark + row.maxMark) / 6)}
                            </td>
                            <td>
                                {`${row.finishedTasksNumber} / ${row.tasksNumber}`}
                            </td>
                            <td>
                                {row.sprintNumber}
                            </td>
                            <td><Button
                                variant="outline-light"
                                size="sm"
                                onClick={() => handleOpenFeature(row)}
                            >Открыть</Button></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Col>
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Feature Modal"
            >
                <FeatureForm styles={styles} isCreation={creationMode} initialFeatureData={formData}
                             closeModal={() => setModalOpen(false)}/>
            </Modal>
        </Row>
    );
};

export default FeatureTable;