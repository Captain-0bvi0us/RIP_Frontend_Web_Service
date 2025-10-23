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

    // Изображение для использования (реальное или дефолтное)
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
                <h2>Фактор не найден 😔</h2>
                <Link to="/factors">
                    <Button variant="outline-danger" className="mt-3">Вернуться к списку</Button>
                </Link>
            </Container>
        );
    }

    const breadcrumbs = [
        { label: 'Факторы риска', path: '/factors' },
        { label: factor.title, active: true }, // Текущая страница - активная
    ];

    return (
        <div className="factor-detail-page">
            {/* Фоновое размытое изображение */}
           <div className="factor-background" />

            {/* Основная карточка с контентом */}
            <div className="factor-content-card">
                {/* Кнопка "Назад" */}
                 <div className="mb-4">
                    <CustomBreadcrumbs crumbs={breadcrumbs} />
                </div>

                <Row className="align-items-center g-5">
                    {/* Колонка с изображением */}
                    <Col lg={5}>
                        <div className="factor-image-wrapper">
                            <img src={displayImage} alt={factor.title} className="factor-main-image" />
                        </div>
                    </Col>

                    {/* Колонка с текстом */}
                    <Col lg={7}>
                        <h1 className="display-5 factor-title">{factor.title}</h1>
                        <div className="factor-text">
                            {/* 
                                Здесь мы просто выводим текст. 
                                Если текст содержит переносы строк (\n), можно использовать:
                                {factor.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                            */}
                            <p>{factor.text}</p>
                        </div>
                        
                        {/* Дополнительная кнопка действия, если нужно */}
                        <Button className='all-btn mt-4 px-4 py-2' variant="danger" size="lg">
                            Добавить в расчет
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
};