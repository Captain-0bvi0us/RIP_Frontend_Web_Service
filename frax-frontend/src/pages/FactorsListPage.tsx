import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Button } from 'react-bootstrap';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FactorCard } from '../components/FactorCard';
import { getFactors } from '../api/factorsApi';
import type { IFactor } from '../types';

export const FactorsListPage = () => {
    const [factors, setFactors] = useState<IFactor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFactors = (title: string) => {
        setLoading(true);
        getFactors(title)
            .then(data => {
                setFactors(data.items);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchFactors('');
    }, []);

    const handleSearch = () => {
        fetchFactors(searchTerm);
    };

    return (
        <Container className="mt-4">
            <Breadcrumbs crumbs={[{ label: 'Факторы риска' }]} />
            <h2>Факторы риска</h2>
            
            <div className="d-flex mb-4">
                <Form.Control
                    type="search"
                    placeholder="Поиск по названию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="me-2"
                />
                <Button onClick={handleSearch} disabled={loading}>Искать</Button>
            </div>
            
            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {factors.map(factor => (
                        <Col key={factor.id}>
                            <FactorCard factor={factor} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};