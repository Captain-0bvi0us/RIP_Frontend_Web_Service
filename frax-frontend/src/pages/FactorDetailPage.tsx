import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getFactorById } from '../api/factorsApi';
import type { IFactor } from '../types';
import { DefaultImage } from '../components/FactorCard';
import {CustomBreadcrumbs} from '../components/Breadcrumbs'
import './styles/FactorDetailPage.css';

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

    const displayImage = factor?.image || DefaultImage;

    if (loading) {
        return (
            <div className="factor-detail-page">
                <Spinner animation="border" variant="danger" style={{ width: '3rem', height: '3rem' }} />
            </div>
        );
    }

    if (!factor) {
        return (
            <Container className="mt-5 pt-5 text-center">
                <h2>Фактор не найден</h2>
                <Link to="/factors">
                    <Button variant="outline-danger" className="mt-3">Вернуться к списку</Button>
                </Link>
            </Container>
        );
    }

    const breadcrumbs = [
        { label: 'Факторы риска', path: '/factors' },
        { label: factor.title, active: true },
    ];

    return (
        <div className="factor-detail-page">
           <div className="factor-background" />
            <div className="factor-content-card">
                 <div className="mb-4">
                    <CustomBreadcrumbs crumbs={breadcrumbs} />
                </div>
                <Row className="align-items-center g-5">
                    <Col lg={5}>
                        <div className="factor-image-wrapper">
                            <img src={displayImage} alt={factor.title} className="factor-main-image" />
                        </div>
                    </Col>
                    <Col lg={7}>
                        <h1 className="display-5 factor-title">{factor.title}</h1>
                        <div className="factor-text">
                            <p>{factor.text}</p>
                        </div>                
                        <Button className='all-btn mt-4 px-4 py-2' variant="danger" size="lg">
                            Добавить в расчет
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
};