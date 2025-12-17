import { useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Badge, Image, Button } from 'react-bootstrap';
import { GearFill } from 'react-bootstrap-icons'; 
import { FactorCard } from '../components/FactorCard';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { fetchFactors } from '../store/slices/factorsSlice';
import { fetchCartBadge } from '../store/slices/cartSlice';
import { setSearchTerm } from '../store/slices/filterSlice';
import type { RootState, AppDispatch } from '../store';
import './styles/FactorsListPage.css';



export const FactorsListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { items: factors, loading } = useSelector((state: RootState) => state.factors);
    const searchTerm = useSelector((state: RootState) => state.filter.searchTerm);
    const cartState = useSelector((state: RootState) => state.cart);
    const isCartActive = cartState.count > 0 && cartState.frax_id !== null;
    const { user } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(fetchFactors(searchTerm));
        dispatch(fetchCartBadge());
    }, [dispatch]);

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault(); 
        dispatch(fetchFactors(searchTerm));
    };

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (cartState.frax_id) {
            navigate(`/orders/${cartState.frax_id}`);
        }
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
                                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                            />
                            <Button variant="danger" type="submit" disabled={loading}>
                                {loading ? 'Поиск...' : 'Искать'}
                            </Button>
                            {user?.moderator && (
                                <Button 
                                    variant="danger" 
                                    className="ms-2 d-flex align-items-center gap-2"
                                    onClick={() => navigate('/factors/manage')}
                                    title="Управление услугами"
                                >
                                    <GearFill /> <span className="d-none d-md-inline">Управление</span>
                                </Button>
                            )}                            
                            <div className="cart-wrapper">
                                {isCartActive ? (                               
                                    <a 
                                        href="#" 
                                        onClick={handleCartClick}
                                        title="Перейти к заявке"
                                    >
                                        <Image src="/mock_images/cart.png" alt="Корзина" width={32} />
                                    </a>
                                ) : (                                  
                                    <div style={{ cursor: 'not-allowed' }}>
                                        <Image src="/mock_images/cart.png" alt="Корзина" width={32} style={{ opacity: 0.5 }} />
                                    </div>
                                )}                               
                                {isCartActive && (
                                    <Badge pill bg="danger" className="cart-indicator">
                                        {cartState.count}
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