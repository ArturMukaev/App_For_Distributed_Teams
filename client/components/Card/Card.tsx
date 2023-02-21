import React from "react";
import {stateMap} from "../../helpers/helper";

interface CardProps {
    name: any;
    description: any;
    isFeature: any;
    state: any;
    addTask: any;
    responsible: any;
    time: any;
    onEdit: any;
}

export const Card = ({name, description, isFeature, state, addTask, responsible, time, onEdit} : CardProps) : JSX.Element => {

    if (isFeature) return (
        <div>
            <div>
                <span>{name}</span>
                <p>{description}</p>
            </div>
            <div>
                <span>Статус: {stateMap().get(Number(state))}</span>
                <button onClick={addTask}>
                    Добавить задачу
                </button>
            </div>
        </div>
    );

    return (
        <div>
            <div>
                <span onClick={onEdit}>{name}</span>
                <p>{`Ответственный: ${responsible}`}</p>
                <p>Статус: {stateMap().get(Number(state))}</p>
                <p>{`Потраченное время: ${time} ч.`}</p>
            </div>
        </div>
    )
}