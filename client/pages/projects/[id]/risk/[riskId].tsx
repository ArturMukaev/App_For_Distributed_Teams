import React, {useCallback, useEffect, useState} from 'react';
import {Button, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import {ConsequenceMap, LikelyHoodMap, riskType} from "../../../../types/api/models";
import {useSelector} from "react-redux";
import {selectors} from "../../../../redux/selectors";
import {useHttp} from "../../../../hooks/useHTTP";
import {useRouter} from "next/router";
import {Loader} from "../../../../components/Loader/Loader";
import {getColorForRisk, notify} from "../../../../helpers/helper";
import {withLayout} from "../../../../layout/Layout";
import styles from "../../../../styles/RiskPage.module.css";

const RiskPage = (): JSX.Element => {
    const {request, loading} = useHttp();
    const {asPath} = useRouter();
    const [risks, setRisks] = useState<riskType[]>([]);
    /** Selectors */
    const users = useSelector(selectors.usersOfProject);

    /** Effect */
    useEffect(() => {
        (async () => {
            try {
                const pathArray = asPath.split("/");
                const response: riskType[] = await request({
                    url: `/api/risk/${pathArray[pathArray.length - 1]}`,
                    method: "GET"
                });
                setRisks(response);
            } catch (error) {
            }
        })();
    }, [request]);

    const handleOpen = useCallback((): void => {
        notify("Функционал в разработке", true);
    }, []);


    if (loading) return <Loader/>;
    return (
        <div className={styles.container}>
            <Table striped bordered variant="dark" responsive className={styles.table}>
                <thead>
                <tr>
                    <th>Наименование</th>
                    <th>Описание</th>
                    <th>Вероятность наступления</th>
                    <th>Уровень последствий</th>
                    <th>Решение</th>
                    <th>Ответственный</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {risks.map((row) => (
                    <tr key={row.id}>
                        <td>
                            <div className={styles.longField}
                                 style={{color: getColorForRisk(row.likelyHood, row.consequence)}}>{row.name}</div>
                        </td>
                        <OverlayTrigger placement="top" overlay={<Tooltip>{row.description}</Tooltip>}>
                            <td>
                                <div className={styles.longField}>{row.description}</div>
                            </td>
                        </OverlayTrigger>
                        <td>{LikelyHoodMap[row.likelyHood as keyof typeof LikelyHoodMap]}</td>
                        <td>{ConsequenceMap[row.consequence as keyof typeof LikelyHoodMap]}</td>
                        <OverlayTrigger placement="top" overlay={<Tooltip>{row.solution}</Tooltip>}>
                            <td>
                                <div className={styles.longField}>{row.solution}</div>
                            </td>
                        </OverlayTrigger>
                        <td>{users.find((user) => user.id === row.responsible)?.name}</td>
                        <td><Button variant="outline-light" size="sm" onClick={handleOpen}
                        >Открыть</Button></td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <Button variant="outline-danger" className={styles.add} onClick={handleOpen}>Добавить
                риск</Button>
        </div>
    );
};

export default withLayout(RiskPage, false);