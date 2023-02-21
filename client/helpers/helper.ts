export const storageName = 'userData';

export const stateMap = () : Map<number,string> => {
    const mapa = new Map();
    mapa.set(1, 'Предложено');
    mapa.set(2, 'Активно');
    mapa.set(3, 'Решено');
    mapa.set(4, 'Закрыто');
    return mapa;
};

export const priorityMap = () : Map<number,string> => {
    const mapa = new Map();
    mapa.set(1, 'Низкий');
    mapa.set(2, 'Средний');
    mapa.set(3, 'Высокий');
    return mapa;
};

export type buttonType = 'primary' | 'secondary' | 'success' | 'warning';