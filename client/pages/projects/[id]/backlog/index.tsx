import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {withLayout} from "../../../../layout/Layout";
import Container from "react-bootstrap/Container";
import FeatureTable from "../../../../components/Table/FeatureTable";
import {featureType} from "../../../../types/api/models";
import {setFeatures} from "../../../../redux/reducers/itemsReducer";
import {useHttp} from "../../../../hooks/useHTTP";
import {selectors} from "../../../../redux/selectors";
import {Loader} from "../../../../components/Loader/Loader";

import styles from "../../../../styles/Backlog.module.css";


const Backlog = (): JSX.Element => {
    const {request, loading} = useHttp();
    const dispatch = useDispatch();

    /** Selectors */
    const selectedProject = useSelector(selectors.selectedProject);
    const features = useSelector(selectors.features);

    /** Effect */
    useEffect(() => {
        (async () => {
            if (!selectedProject) return;
            try {
                const response: featureType[] = await request({url: `/api/feature/${selectedProject?.id}`, method: "GET"});
                dispatch(setFeatures(response));
            } catch (error) {
            }
        })();
    }, [selectedProject, dispatch, request]);

    if (loading) return <Loader/>;
    return (
        <>
            <Container fluid className={styles.backlog}>
                <h1>Бэклог проекта</h1>
                <FeatureTable styles={styles} features={features}/>
            </Container>
        </>
    );
};

export default withLayout(Backlog, false);
