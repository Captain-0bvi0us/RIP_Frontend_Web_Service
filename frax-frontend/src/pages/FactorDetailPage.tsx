import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Image, Row, Col } from 'react-bootstrap';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getFactorById } from '../api/factorsApi';
import type { IFactor } from '../types';
import {DefaultImage} from '../components/FactorCard'

export const FactorDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [factor, setFactor] = useState<IFactor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getFactorById(id)
                .then(data => setFactor(data))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    if (!factor) {
        return <Container className="mt-4"><h2>Фактор не найден</h2></Container>;
    }

    return (
        <Container className="mt-4">
            <Breadcrumbs crumbs={[
                { label: 'Факторы риска', path: '/factors' },
                { label: factor.title }
            ]} />
            <Row className="mt-4">
                <Col md={4}>
                    <Image src={factor.image || DefaultImage} fluid rounded />
                </Col>
                <Col md={8}>
                    <h2>{factor.title}</h2>
                    <p>{factor.text}</p>
                </Col>
            </Row>
        </Container>
    );
};