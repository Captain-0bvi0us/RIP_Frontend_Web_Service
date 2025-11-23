import React, { useEffect, useState } from 'react';
import { Container, Table, Form, Row, Col, Badge, Spinner, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrdersList } from '../store/slices/fraxSlice';
import type { AppDispatch, RootState } from '../store';



const getStatusBadge = (status: number | undefined) => {
    switch (status) {
        case 1: return <Badge bg="secondary">Черновик</Badge>;
        case 2: return <Badge bg="dark">Удалена</Badge>;
        case 3: return <Badge bg="primary">В работе</Badge>;
        case 4: return <Badge bg="success">Завершена</Badge>;
        case 5: return <Badge bg="danger">Отклонена</Badge>;
        default: return <Badge bg="light" text="dark">Неизвестно</Badge>;
    }
};

export const OrdersListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { list, loading } = useSelector((state: RootState) => state.frax);

    const [filters, setFilters] = useState({
        status: 'all',
        from: '',
        to: ''
    });

    useEffect(() => {
        dispatch(fetchOrdersList(filters));
    }, [dispatch, filters]);

    const handleRowClick = (id: number | undefined) => {
        if (id) navigate(`/orders/${id}`);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <Container className="pt-5 mt-5">
            <h2 className="fw-bold mb-4 text-center" style={{ color: '#495057' }}>История заявок</h2>

            <Card className="mb-4 border-0 shadow-sm bg-light">
                 <Card.Body>
                    <Row className="g-3">
                        <Col md={4}>
                            <Form.Label>Статус</Form.Label>
                            <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
                                <option value="all">Любой статус</option>
                                <option value="3">В работе (Сформирована)</option>
                                <option value="4">Завершена</option>
                                <option value="5">Отклонена</option>
                            </Form.Select>
                        </Col>
                        <Col md={4}>
                            <Form.Label>Дата оформления (от)</Form.Label>
                            <Form.Control type="date" name="from" value={filters.from} onChange={handleFilterChange} />
                        </Col>
                        <Col md={4}>
                            <Form.Label>Дата оформления (до)</Form.Label>
                            <Form.Control type="date" name="to" value={filters.to} onChange={handleFilterChange} />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {loading ? (
                <div className="text-center"><Spinner animation="border" variant="danger" /></div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <Table hover className="align-middle mb-0 bg-white">
                        <thead className="bg-light">
                            <tr>
                                <th>#</th>
                                <th>Статус</th>                            
                                <th>Дата создания</th>
                                <th>Дата оформления</th> 
                                <th>Дата завершения</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(list || []).length > 0 ? (list || []).map((order) => (
                                <tr 
                                    key={order.id} 
                                    onClick={() => handleRowClick(order.id)} 
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td className="fw-bold">{order.id}</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    
                                    <td>
                                        {order.creation_date 
                                            ? new Date(order.creation_date).toLocaleString('ru-RU') 
                                            : <span className="text-muted">--</span>}
                                    </td>

                                    <td>
                                        {order.forming_date 
                                            ? new Date(order.forming_date).toLocaleString('ru-RU') 
                                            : <span className="text-muted">--</span>}
                                    </td>
                                    <td>
                                        {order.complition_date 
                                            ? new Date(order.complition_date).toLocaleString('ru-RU') 
                                            : <span className="text-muted">--</span>}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-muted">Заявок не найдено</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
};