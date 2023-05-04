import React from 'react';
import {Form} from "react-bootstrap";
import {StateOfWI} from "../../../types/api/models";

interface IProps {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => void;
    disabled?: boolean;
}

const StateSelect = ({value, onChange, disabled = false}: IProps) => {
    return (
        <Form.Select aria-label="select" name="state" value={value}
                     onChange={onChange} disabled={disabled}>
            <option value={StateOfWI.Proposed}>{StateOfWI.Proposed}</option>
            <option value={StateOfWI.Active}>{StateOfWI.Active}</option>
            <option value={StateOfWI.Resolved}>{StateOfWI.Resolved}</option>
            <option value={StateOfWI.Closed}>{StateOfWI.Closed}</option>
        </Form.Select>
    );
};

export default StateSelect;
