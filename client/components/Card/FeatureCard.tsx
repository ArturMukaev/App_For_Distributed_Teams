import React from "react";
import {FeatureType, StateOfWI} from "../../types/api/models";
import {Button, Card, OverlayTrigger, Tooltip} from "react-bootstrap";
import styles from "../../styles/FeatureCard.module.css";

interface CardProps {
    name: string;
    id: string;
    state: StateOfWI;
    type: FeatureType;
    addTask: (feature: string) => void;
}

const FeatureCard = ({name, state, addTask, type, id} : CardProps) : JSX.Element => {

    return (
        <Card
            className={styles.card}
            bg={type === FeatureType.Feature ? "info" : "danger"}
            text="dark"
        >
            <Card.Body className={styles.body}>
                <OverlayTrigger placement="top" overlay={<Tooltip>{name}</Tooltip>}>
                    <Card.Title className={styles.title}>{name}</Card.Title>
                </OverlayTrigger>
                <Card.Subtitle className="mb-4 text-center">Статус: {state}</Card.Subtitle>
                <Button variant="outline-dark" onClick={() => addTask(id)}>Добавить задачу</Button>
            </Card.Body>
        </Card>
    );
};

export default FeatureCard;