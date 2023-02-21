import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import "../styles/auth.css";

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

export const ModalWindow = ({isOpen, closeModal, isFeature, featureProps, taskProps, save, users }) => {
    const [data, setData] = useState(isFeature? featureProps : taskProps);

    useEffect(() =>{
        window.M.updateTextFields()
    },[]);

    const changeHandler = event => {
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
                <div className="card">
                    <div className="card-header">
                        <h1>Введите данные</h1>
                    </div>
                    <div className="card-body">
                        <form>

                            <div className="mb-3">
                                <label htmlFor="exampleInputName" className="form-label">Название</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    placeholder="Введите название"
                                    value={data.name}
                                    onChange={changeHandler}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="exampleInputDescription" className="form-label">Описание</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="description"
                                    placeholder="Введите описание"
                                    name="description"
                                    value={data.description}
                                    onChange={changeHandler}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="exampleInputFather" className="form-label">Статус</label>
                                <div className="input-field">
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
                                <div className="mb-3">
                                    <label htmlFor="exampleInputFather" className="form-label">Приоритет</label>
                                    <div className="input-field">
                                        <select defaultValue={data.priority} name="priority" onChange={changeHandler}>
                                            <option value="" disabled>Выберите приоритет</option>
                                            <option value={1}>Низкий</option>
                                            <option value={2}>Средний</option>
                                            <option value={3}>Высокий</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="exampleInputSprint" className="form-label">Спринт</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="sprint"
                                        placeholder="Введите спринт"
                                        name="sprintNumber"
                                        value={data.sprintNumber}
                                        onChange={changeHandler}
                                    />
                                </div>
                            </div> :
                                <div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInput" className="form-label">Ответственный</label>
                                        <div className="input-field">
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

                                    <div className="mb-3">
                                        <label htmlFor="exampleInputTime" className="form-label">Списанное время</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="time"
                                            placeholder="Введите время в часах"
                                            name="time"
                                            value={data.time}
                                            onChange={changeHandler}
                                        />
                                    </div>
                                </div>
                            }

                            <button
                                className="btn btn-enter cyan darken-4"
                                onClick={(event) => {
                                    event.preventDefault();
                                    save(data);
                                }}
                            >Сохранить
                            </button>

                        </form>
                    </div>
                </div>
            </Modal>
    );
}
