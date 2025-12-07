import React, { useEffect, useState, useMemo } from 'react';
import { Container, Table, Form, Row, Col, Badge, Spinner, Card, ListGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrdersList } from '../store/slices/fraxSlice';
import { ExclamationCircleFill, Funnel, PersonFill } from 'react-bootstrap-icons';
import type { AppDispatch, RootState } from '../store';
import './styles/OrdersListPage.css'; // Создай этот файл для стилей (код ниже)

const STATUS_FORMED = 3;

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
    const { user } = useSelector((state: RootState) => state.user);

    // Фильтры для API (Бэкенд)
    const [apiFilters, setApiFilters] = useState({
        status: 'all',
        from: '',
        to: ''
    });

    // Фильтр по пользователю (Фронтенд, только для модератора)
    const [selectedCreatorId, setSelectedCreatorId] = useState<number | 'all'>('all');

    // --- SHORT POLLING ---
    useEffect(() => {
        const loadData = () => dispatch(fetchOrdersList(apiFilters));
        
        loadData(); // Первый запуск

        // Запускаем интервал каждые 5 секунд
        const intervalId = setInterval(loadData, 5000);

        // Очистка при размонтировании
        return () => clearInterval(intervalId);
    }, [dispatch, apiFilters]); // Перезапуск при смене API фильтров

    // --- ЛОГИКА МОДЕРАТОРА: Список пользователей ---
    // Вычисляем список уникальных пользователей из загруженных заявок
    const creatorsStats = useMemo(() => {
        if (!list) return [];
        const stats = new Map<number, { countFormed: number, total: number, name: string }>();

        list.forEach(order => {
            const creatorId = order.creator_login || 0; // В DTO поле называется creator_login, но там ID
            // Так как бэкенд не возвращает имя в списке (пока), используем ID или заглушку
            // Если бы бэкенд возвращал имя, мы бы брали его оттуда.
            const creatorName = `Пользователь #${creatorId}`; 

            if (!stats.has(creatorId)) {
                stats.set(creatorId, { countFormed: 0, total: 0, name: creatorName });
            }
            
            const stat = stats.get(creatorId)!;
            stat.total += 1;
            if (order.status === STATUS_FORMED) {
                stat.countFormed += 1;
            }
        });

        return Array.from(stats.entries()).map(([id, data]) => ({ id, ...data }));
    }, [list]);

    // --- ФИЛЬТРАЦИЯ СПИСКА (Frontend) ---
    const displayedList = useMemo(() => {
        if (!list) return [];
        if (!user?.moderator) return list; // Обычный юзер видит то, что прислал бэкенд (свои)
        
        // Модератор: фильтр по выбранному юзеру
        if (selectedCreatorId === 'all') return list;
        return list.filter(order => order.creator_login === selectedCreatorId);
    }, [list, user?.moderator, selectedCreatorId]);


    const handleRowClick = (id: number | undefined) => {
        if (id) navigate(`/orders/${id}`);
    };

    const handleApiFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setApiFilters({ ...apiFilters, [e.target.name]: e.target.value });
    };

    return (
        <Container fluid className="pt-5 mt-5 px-4">
            <h2 className="fw-bold mb-4 text-center text-secondary">
                {user?.moderator ? 'Панель Модератора' : 'История заявок'}
            </h2>

            <Row>
                {/* --- ЛЕВАЯ КОЛОНКА (Только для модератора) --- */}
                {user?.moderator && (
                    <Col lg={3} className="mb-4">
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Header className="bg-danger text-white fw-bold d-flex align-items-center gap-2">
                                <PersonFill /> Пользователи
                            </Card.Header>
                            <ListGroup variant="flush" className="user-filter-list">
                                <ListGroup.Item 
                                    action 
                                    active={selectedCreatorId === 'all'}
                                    onClick={() => setSelectedCreatorId('all')}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <span>Все пользователи</span>
                                    <Badge bg="secondary" pill>{list.length}</Badge>
                                </ListGroup.Item>
                                
                                {creatorsStats.map(creator => (
                                    <ListGroup.Item 
                                        key={creator.id}
                                        action
                                        active={selectedCreatorId === creator.id}
                                        onClick={() => setSelectedCreatorId(creator.id)}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <span>{creator.name}</span>
                                        <div className="d-flex gap-2 align-items-center">
                                            {creator.countFormed > 0 && (
                                                <ExclamationCircleFill className="text-warning blink-icon" title="Есть необработанные заявки" />
                                            )}
                                            <Badge bg="light" text="dark" pill>{creator.total}</Badge>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    </Col>
                )}

                {/* --- ПРАВАЯ КОЛОНКА (Таблица и фильтры) --- */}
                <Col lg={user?.moderator ? 9 : 12}>
                    <Card className="mb-4 border-0 shadow-sm bg-white">
                        <Card.Body>
                            <Row className="g-3 align-items-end">
                                <Col md={user?.moderator ? 3 : 4}>
                                    <Form.Label className="fw-bold small text-muted">Статус</Form.Label>
                                    <Form.Select name="status" value={apiFilters.status} onChange={handleApiFilterChange} size="sm">
                                        <option value="all">Все статусы</option>
                                        <option value="3">В работе</option>
                                        <option value="4">Завершена</option>
                                        <option value="5">Отклонена</option>
                                    </Form.Select>
                                </Col>
                                <Col md={user?.moderator ? 3 : 4}>
                                    <Form.Label className="fw-bold small text-muted">Дата от</Form.Label>
                                    <Form.Control type="date" name="from" value={apiFilters.from} onChange={handleApiFilterChange} size="sm" />
                                </Col>
                                <Col md={user?.moderator ? 3 : 4}>
                                    <Form.Label className="fw-bold small text-muted">Дата до</Form.Label>
                                    <Form.Control type="date" name="to" value={apiFilters.to} onChange={handleApiFilterChange} size="sm" />
                                </Col>
                                {user?.moderator && (
                                    <Col md={3} className="text-end">
                                        <Button variant="outline-secondary" size="sm" onClick={() => dispatch(fetchOrdersList(apiFilters))}>
                                            Обновить <Funnel />
                                        </Button>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>

                    {loading && list.length === 0 ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>
                    ) : (
                        <div className="table-responsive shadow-sm rounded bg-white">
                            <Table hover className="align-middle mb-0">
                                <thead className="bg-light text-secondary">
                                    <tr>
                                        <th>ID</th>
                                        {user?.moderator && <th>Пользователь</th>}
                                        <th>Статус</th>                            
                                        <th>Дата создания</th>
                                        <th>Дата оформления</th> 
                                        <th>Результат (POF/PHF)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedList.length > 0 ? displayedList.map((order) => (
                                        <tr 
                                            key={order.id} 
                                            onClick={() => handleRowClick(order.id)} 
                                            style={{ cursor: 'pointer' }}
                                            className={user?.moderator && order.status === STATUS_FORMED ? "table-warning-soft" : ""}
                                        >
                                            <td className="fw-bold">#{order.id}</td>
                                            {user?.moderator && (
                                                <td className="small text-muted">ID: {order.creator_login}</td>
                                            )}
                                            <td>{getStatusBadge(order.status)}</td>
                                            
                                            <td className="small">
                                                {order.creation_date 
                                                    ? new Date(order.creation_date).toLocaleDateString() 
                                                    : '-'}
                                            </td>

                                            <td className="small">
                                                {order.forming_date 
                                                    ? new Date(order.forming_date).toLocaleString() 
                                                    : '-'}
                                            </td>
                                            <td>
                                                {(order.POF || 0) > 0 ? (
                                                    <span className="fw-bold text-success">
                                                        {order.POF?.toFixed(1)}% / {order.PHF?.toFixed(1)}%
                                                    </span>
                                                ) : (
                                                    <span className="text-muted small">--</span>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={user?.moderator ? 6 : 5} className="text-center py-5 text-muted">
                                                Заявок не найдено
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};