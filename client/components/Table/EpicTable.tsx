import React, {useCallback, useMemo, useState} from 'react';
import {Button, Table} from "react-bootstrap";
import {RoleInProject, workItemType, StateOfWI} from "../../types/api/models";
import EpicModal from "../Modal/EpicModal";
import {useSelector} from "react-redux";
import {selectors} from "../../redux/selectors";
import {notify} from "../../helpers/helper";

interface IProps {
    epics: workItemType[],
    styles: any,
}

const EpicTable = ({epics, styles}: IProps): JSX.Element => {

    /** Selectors */
    const selectedProject = useSelector(selectors.selectedProject);
    const isUserLeader = selectedProject?.role === RoleInProject.Leader;

    /** Memo */
    const initialData = useMemo((): workItemType => ({
        name: '',
        description: '',
        state: StateOfWI.Proposed,
        id: '',
    }), []);

    /** State */
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [creationMode, setCreationMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<workItemType>(initialData);

    /** Handler */
    const handleOpenEpic = useCallback((row: workItemType): void => {
        setFormData(row);
        setCreationMode(false);
        setModalOpen(true);
    }, []);

    const handleOpenRisks = useCallback((): void => {
        notify("Функционал в разработке", true);
    }, []);

    const handleCreateEpic = useCallback((): void => {
        setFormData(initialData);
        setCreationMode(true);
        setModalOpen(true);
    }, [initialData]);

    return (
        <div>
            <Table striped bordered variant="dark" responsive className={styles.table}>
                <thead>
                <tr>
                    <th>Наименование</th>
                    <th>Статус</th>
                    <th>Риски</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {epics.map((row) => (
                    <tr key={row.id}>
                        <td>
                            <div className={styles.name}>{row.name}</div>
                        </td>
                        <td>
                            {row.state}
                        </td>
                        <td><Button variant="outline-light" size="sm" onClick={handleOpenRisks}>Открыть</Button></td>
                        <td><Button
                            variant="outline-light"
                            size="sm"
                            onClick={() => handleOpenEpic(row)}
                        >Открыть</Button></td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {isUserLeader &&
                <Button variant="outline-warning" className={styles.golden} onClick={handleCreateEpic}>Добавить
                    эпик</Button>
            }
            <EpicModal
                isOpen={modalOpen}
                closeModal={() => setModalOpen(false)}
                isControlsDisabled={!isUserLeader}
                styles={styles}
                initialFormData={formData}
                isCreation={creationMode}
            />
        </div>
    );
};

export default EpicTable;
