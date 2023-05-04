import React from 'react';
import Modal from 'react-modal';
import EpicForm from "../Form/EpicForm";
import {workItemType} from "../../types/api/models";

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
        width: "350px",
    },
};

export interface EpicModalProps {
    isOpen: boolean;
    closeModal: () => void;
    styles: any;
    isCreation: boolean;
    initialFormData: workItemType;
    isControlsDisabled: boolean;
}

const EpicModal = ({isOpen, ...props} : EpicModalProps): JSX.Element => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={props.closeModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Epic Modal"
        >
            <EpicForm {...props} />
        </Modal>
    );
};

export default EpicModal;
