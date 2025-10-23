import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Badge, Image, Button } from 'react-bootstrap'; // 1. Добавляем Button
import { FactorCard } from '../components/FactorCard';
import { getFactors } from '../api/factorsApi';
import type { IFactor } from '../types';
import './styles/FactorsListPage.css'; 

export const FactorsListPage = () => {
    const [factors, setFactors] = useState<IFactor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartCount, setCartCount] = useState(1);

 const fetchFactors = (filterTitle: string) => {
    setLoading(true);
    getFactors(filterTitle)
        .then(data => {
            if (Array.isArray(data.items)) {
                setFactors(data.items);
            } else {
                console.error("Получены неверные данные:", data);
                setFactors([]);
            }
        })
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchFactors('');
    }, []);

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault(); 
        fetchFactors(searchTerm);
    };

    return (
        <Container fluid className="pt-5 mt-4"> 
            <h1 className="text-center fs-3 fw-bold">Факторы риска</h1>
            <hr className="factors-header-line" />

            <Form onSubmit={handleSearchSubmit}>
                <Row className="justify-content-center mb-4">
                    <Col xs={12} md={10} lg={8}>
                        <div className="search-and-cart-wrapper">
                            <Form.Control
                                type="search"
                                placeholder="Введите название фактора для поиска..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="danger" type="submit" disabled={loading}>
                                {loading ? 'Поиск...' : 'Искать'}
                            </Button>
                            <div className="cart-wrapper">
                                <Image src="http://localhost:9000/factors/Images/Корзина.png" alt="Корзина" width={32} />
                                {cartCount > 0 && (
                                    <Badge pill bg="danger" className="cart-indicator">
                                        {cartCount}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Form>

            {loading ? (
                <div className="text-center"><Spinner animation="border" variant="danger" /></div>
            ) : (
                <Row className="justify-content-center">
                    <Col xs={12} lg={10}>
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {factors.map(factor => (
                                <Col key={factor.id}>
                                    <FactorCard factor={factor} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            )}
        </Container>
    );
};