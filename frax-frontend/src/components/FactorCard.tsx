import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { IFactor } from '../types';

export const DefaultImage = 'http://localhost:9000/factors/Images/Default.png'

interface FactorCardProps {
    factor: IFactor;
}

export const FactorCard: React.FC<FactorCardProps> = ({ factor }) => (
    <Card className="h-100">
        <Card.Img variant="top" src={factor.image || DefaultImage} style={{ height: '200px', objectFit: 'cover' }} />
        <Card.Body className="d-flex flex-column">
            <Card.Title>{factor.title}</Card.Title>
            <div className="mt-auto">
                <Link to={`/factors/${factor.id}`}>
                    <Button variant="primary" className="me-2">Подробнее</Button>
                </Link>
                <Button variant="success">Добавить</Button>
            </div>
        </Card.Body>
    </Card>
);