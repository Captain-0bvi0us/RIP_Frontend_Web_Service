import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { IFactor } from '../types';
import './styles/FactorCard.css'

export const DefaultImage = 'http://localhost:9000/factors/Images/Default.png'

interface FactorCardProps {
    factor: IFactor;
}

export const FactorCard: React.FC<FactorCardProps> = ({ factor }) => {
    return (
        <div className="p-4 border rounded shadow-sm h-100 bg-light factor-card">
            <Row className="align-items-center">
                <Col xs={4} md={3}>
                    <img
                        src={factor.image || DefaultImage}
                        alt={factor.title}
                        className="img-fluid"
                    />
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
                            <Button className='all-btn' variant="danger">
                                Добавить
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};