import React from "react";
import "../styles/card.css";
import { stateMap } from "../pages/BacklogPage"

export const Card = ({name, description, isFeature, state, addTask, responsible, time, onEdit}) => {

    if (isFeature) return (
                <div className="card card-feature cyan lighten-5">
                    <div className="card-content white-text">
                        <span className="card-title">{name}</span>
                        <p>{description}</p>
                    </div>
                    <div className="card-action">
                        <span>Статус: {stateMap().get(Number(state))}</span>
                        <button
                            className="btn red darken-1"
                            onClick={addTask}
                        >
                            Добавить задачу
                        </button>
                    </div>
                </div>
    );

    return (
        <div className="card card-task green accent-2">
            <div className="card-content white-text">
                <span className="card-title" onClick={onEdit}>{name}</span>
                <p>{`Ответственный: ${responsible}`}</p>
                <p>Статус: {stateMap().get(Number(state))}</p>
                <p>{`Потраченное время: ${time} ч.`}</p>
            </div>
        </div>
    )
}