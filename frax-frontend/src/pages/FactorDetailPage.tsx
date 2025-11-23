import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Row, Col, Button } from 'react-bootstrap';
import { DefaultImage } from '../components/FactorCard';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFactorById, clearCurrentFactor } from '../store/slices/factorsSlice';
import type { RootState, AppDispatch } from '../store';
import './styles/FactorDetailPage.css';



export const FactorDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { currentFactor: factor, loading } = useSelector((state: RootState) => state.factors);
    const displayImage = factor?.image || DefaultImage;

    useEffect(() => {
        if (id) {
            dispatch(fetchFactorById(id));
        }
        return () => {
            dispatch(clearCurrentFactor());
        };
    }, [id, dispatch]);

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
                    </Col>
                </Row>
            </div>
        </div>
    );
};