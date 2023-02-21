import React, {useState} from 'react';
import Modal from 'react-modal';
import {Button} from "../controls/Button/Button";
import {featureType, taskType, userType} from "../../redux/types";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

interface ModalWindowProps {
    isOpen: boolean;
    closeModal: () => void;
    isFeature: boolean;
    itemProps: featureType & taskType;
    save: (data: featureType) => Promise<any>;
    users: userType[];
}

export const ModalWindow = ({isOpen, closeModal, isFeature, itemProps, save, users } : ModalWindowProps) => {
    const [data, setData] = useState(itemProps);

    const changeHandler = (event : React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
        setData({...data, [event.target.name]: event.target.value});
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Example Modal"
        >
            <div>
                <div>
                    <h1>Введите данные</h1>
                </div>
                <div>
                    <form>

                        <div>
                            <label>Название</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Введите название"
                                value={data.name}
                                onChange={changeHandler}
                            />
                        </div>

                        <div>
                            <label>Описание</label>
                            <input
                                type="text"
                                id="description"
                                placeholder="Введите описание"
                                name="description"
                                value={data.description}
                                onChange={changeHandler}
                            />
                        </div>

                        <div>
                            <label>Статус</label>
                            <div>
                                <select defaultValue={data.state} name="state" onChange={changeHandler}>
                                    <option value="" disabled>Выберите статус</option>
                                    <option value={1}>Предложено</option>
                                    <option value={2}>Активно</option>
                                    <option value={3}>Решено</option>
                                    <option value={4}>Закрыто</option>
                                </select>
                            </div>
                        </div>

                        {isFeature ?
                            <div>
                                <div>
                                    <label>Приоритет</label>
                                    <div>
                                        <select defaultValue={data.priority} name="priority" onChange={changeHandler}>
                                            <option value="" disabled>Выберите приоритет</option>
                                            <option value={1}>Низкий</option>
                                            <option value={2}>Средний</option>
                                            <option value={3}>Высокий</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label>Спринт</label>
                                    <input
                                        type="number"
                                        id="sprint"
                                        placeholder="Введите спринт"
                                        name="sprintNumber"
                                        value={data.sprintNumber}
                                        onChange={changeHandler}
                                    />
                                </div>
                            </div> :
                            <div>
                                <div>
                                    <label>Ответственный</label>
                                    <div>
                                        <select defaultValue={data.responsible} name="responsible" onChange={changeHandler}>
                                            <option value="" disabled>Выберите ответственного</option>
                                            {users.map((item) => {
                                                return (
                                                    <option key={item._id} value={item._id}>{`${item.surname} ${item.email}`}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label>Списанное время</label>
                                    <input
                                        type="number"
                                        id="time"
                                        placeholder="Введите время в часах"
                                        name="time"
                                        value={data.time}
                                        onChange={changeHandler}
                                    />
                                </div>
                            </div>
                        }

                        <Button
                            appearance='success'
                            onClick={(event) => {
                                event.preventDefault();
                                save(data);
                            }}
                        >Сохранить
                        </Button>
                    </form>
                </div>
            </div>
        </Modal>
    );
}