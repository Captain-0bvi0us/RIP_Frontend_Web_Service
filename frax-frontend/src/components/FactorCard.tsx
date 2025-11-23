import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addFactorToDraft } from '../store/slices/cartSlice';
import type { RootState, AppDispatch } from '../store';
import type { FactorCardProps } from '../types';
import './styles/FactorCard.css'



export const DefaultImage = '/mock_images/default.png'

export const FactorCard: React.FC<FactorCardProps> = ({ factor }) => {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    const handleAdd = () => {
        if (factor.id) {
            dispatch(addFactorToDraft(factor.id));
        }
    };

    return (
        <div className="p-4 border rounded shadow-sm h-100 bg-light factor-card">
            <Row className="align-items-center">
                <Col xs={4} md={3}>
                    <img src={factor.image || DefaultImage} alt={factor.title} className="img-fluid"/>
                </Col>
                <Col xs={8} md={9}>
                    <div className="d-flex flex-column justify-content-between h-100">
                        <h5 className="fw-bold mb-3">{factor.title}</h5>
                        <div className="d-flex gap-2">
                            <Link to={`/factors/${factor.id}`} className="text-decoration-none">
                                <Button className='all-btn' variant="danger">
                                    Подробнее
                                </Button>
                            </Link>
                            {isAuthenticated && (
                                <Button 
                                    className='all-btn' 
                                    variant="danger"
                                    onClick={handleAdd}
                                >
                                    Добавить
                                </Button>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};