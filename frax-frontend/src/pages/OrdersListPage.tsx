import React, { useEffect, useState, useMemo } from 'react';
import { Container, Table, Form, Row, Col, Badge, Spinner, Card, Button, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrdersList } from '../store/slices/fraxSlice';
import { ExclamationCircleFill, PersonFill, Search, Filter, ArrowUp, ArrowDown } from 'react-bootstrap-icons';
import type { AppDispatch, RootState } from '../store';
import './styles/OrdersListPage.css';



const STATUS_FORMED = 3;

const getStatusBadge = (status: number | undefined) => {
    switch (status) {
        case 1: return <Badge bg="secondary" className="fw-normal px-3">Черновик</Badge>;
        case 2: return <Badge bg="dark" className="fw-normal px-3">Удалена</Badge>;
        case 3: return <Badge bg="primary" className="fw-normal px-3">В работе</Badge>;
        case 4: return <Badge bg="success" className="fw-normal px-3">Завершена</Badge>;
        case 5: return <Badge bg="danger" className="fw-normal px-3">Отклонена</Badge>;
        default: return <Badge bg="light" text="dark" className="fw-normal px-3">Неизвестно</Badge>;
    }
};

export const OrdersListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { list, loading } = useSelector((state: RootState) => state.frax);
    const { user } = useSelector((state: RootState) => state.user);
    const [apiFilters, setApiFilters] = useState({ status: 'all', from: '', to: '' });
    const [selectedCreatorId, setSelectedCreatorId] = useState<number | 'all'>('all');
    const [userSearch, setUserSearch] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        const loadData = () => dispatch(fetchOrdersList(apiFilters));
        loadData(); 
        const intervalId = setInterval(loadData, 15000); 
        return () => clearInterval(intervalId);
    }, [dispatch, apiFilters]);

    const creatorsStats = useMemo(() => {
        if (!list) return [];
        const stats = new Map<number, { countFormed: number, total: number, name: string }>();

        list.forEach(order => {
            const creatorId = order.creator_login || 0; 
            const creatorName = `Врач #${creatorId}`; 

            if (!stats.has(creatorId)) {
                stats.set(creatorId, { countFormed: 0, total: 0, name: creatorName });
            }
            
            const stat = stats.get(creatorId)!;
            stat.total += 1;
            if (order.status === STATUS_FORMED) {
                stat.countFormed += 1;
            }
        });

        return Array.from(stats.entries())
            .map(([id, data]) => ({ id, ...data }))
            .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()));
    }, [list, userSearch]);

    const displayedList = useMemo(() => {
        if (!list) return [];
        
        let result = [...list];

        if (user?.moderator && selectedCreatorId !== 'all') {
            result = result.filter(order => order.creator_login === selectedCreatorId);
        }

        result.sort((a, b) => {
            const idA = a.id || 0;
            const idB = b.id || 0;
            return sortOrder === 'asc' ? idA - idB : idB - idA;
        });

        return result;
    }, [list, user?.moderator, selectedCreatorId, sortOrder]);

    const handleRowClick = (id: number | undefined) => {
        if (id) navigate(`/orders/${id}`);
    };

    const handleApiFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setApiFilters({ ...apiFilters, [e.target.name]: e.target.value });
    };

    const toggleSort = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    return (
        <Container fluid className="pt-5 mt-5 px-4 px-lg-5">
            <h2 className="fw-bold mb-5 text-dark">
                {user?.moderator ? 'Панель Модератора' : 'История заявок'}
            </h2>

            <Row className="g-4">
                {user?.moderator && (
                    <Col lg={3} xl={2}>
                        <div className="moderator-sidebar">
                            <div className="sidebar-header mb-3">
                                <small className="text-uppercase text-muted fw-bold ls-1">Авторы заявок</small>
                            </div>
                            
                            <InputGroup className="mb-3 shadow-sm">
                                <InputGroup.Text className="bg-white border-end-0"><Search size={14}/></InputGroup.Text>
                                <Form.Control 
                                    placeholder="Поиск..." 
                                    className="border-start-0 ps-0"
                                    value={userSearch}
                                    onChange={e => setUserSearch(e.target.value)}
                                />
                            </InputGroup>

                            <div className="user-list-container custom-scrollbar">
                                <div 
                                    className={`user-list-item ${selectedCreatorId === 'all' ? 'active' : ''}`}
                                    onClick={() => setSelectedCreatorId('all')}
                                >
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="avatar-placeholder bg-secondary text-white">ALL</div>
                                        <span className="fw-medium">Все</span>
                                    </div>
                                    <Badge bg="secondary" className="rounded-pill">{list.length}</Badge>
                                </div>

                                {creatorsStats.map(creator => (
                                    <div 
                                        key={creator.id}
                                        className={`user-list-item ${selectedCreatorId === creator.id ? 'active' : ''}`}
                                        onClick={() => setSelectedCreatorId(creator.id)}
                                    >
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="avatar-placeholder bg-light text-dark">
                                                <PersonFill />
                                            </div>
                                            <div className="d-flex flex-column">
                                                <span className="fw-medium text-truncate" style={{maxWidth: '120px'}}>{creator.name}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                            {creator.countFormed > 0 && (
                                                <ExclamationCircleFill className="text-warning pulse-animation" title="Требует внимания" />
                                            )}
                                            <span className="text-muted small ms-1">{creator.total}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                )}

                <Col lg={user?.moderator ? 9 : 12} xl={user?.moderator ? 10 : 12}>
                    <Card className="border-0 shadow-sm bg-white rounded-4 overflow-hidden h-100">
                        <div className="p-4 border-bottom bg-light-subtle">
                            <Row className="g-3 align-items-end">
                                <Col md={user?.moderator ? 3 : 4}>
                                    <Form.Label className="fw-bold small text-muted text-uppercase ls-1">Статус</Form.Label>
                                    <Form.Select name="status" value={apiFilters.status} onChange={handleApiFilterChange} className="border-0 shadow-sm">
                                        <option value="all">Все заявки</option>
                                        <option value="3">В работе</option>
                                        <option value="4">Завершена</option>
                                        <option value="5">Отклонена</option>
                                    </Form.Select>
                                </Col>
                                <Col md={user?.moderator ? 3 : 4}>
                                    <Form.Label className="fw-bold small text-muted text-uppercase ls-1">Дата от</Form.Label>
                                    <Form.Control type="date" name="from" value={apiFilters.from} onChange={handleApiFilterChange} className="border-0 shadow-sm" />
                                </Col>
                                <Col md={user?.moderator ? 3 : 4}>
                                    <Form.Label className="fw-bold small text-muted text-uppercase ls-1">Дата до</Form.Label>
                                    <Form.Control type="date" name="to" value={apiFilters.to} onChange={handleApiFilterChange} className="border-0 shadow-sm" />
                                </Col>
                                {user?.moderator && (
                                    <Col md={3} className="text-end">
                                        <Button variant="dark" onClick={() => dispatch(fetchOrdersList(apiFilters))}>
                                            <Filter className="me-2" /> Применить
                                        </Button>
                                    </Col>
                                )}
                            </Row>
                        </div>
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 custom-table">
                                <thead className="bg-light">
                                    <tr>
                                        <th 
                                            className="ps-4 text-nowrap" 
                                            style={{ cursor: 'pointer', userSelect: 'none' }}
                                            onClick={toggleSort}
                                            title="Нажмите для сортировки"
                                        >
                                            ID 
                                            {sortOrder === 'asc' ? <ArrowUp className="ms-1" size={12}/> : <ArrowDown className="ms-1" size={12}/>}
                                        </th>
                                        
                                        {user?.moderator && <th>Автор</th>}
                                        <th>Статус</th>                            
                                        <th>Создана</th>
                                        <th>Оформлена</th> 
                                        <th>Результат</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && list.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-5"><Spinner animation="border" variant="danger" /></td></tr>
                                    ) : displayedList.length > 0 ? displayedList.map((order) => (
                                        <tr 
                                            key={order.id} 
                                            onClick={() => handleRowClick(order.id)} 
                                            className={user?.moderator && order.status === STATUS_FORMED ? "row-attention" : ""}
                                        >
                                            <td className="ps-4 fw-bold text-muted">#{order.id}</td>
                                            {user?.moderator && (
                                                <td className="small fw-semibold">User {order.creator_login}</td>
                                            )}
                                            <td>{getStatusBadge(order.status)}</td>
                                            <td className="small text-muted">{order.creation_date ? new Date(order.creation_date).toLocaleDateString() : '-'}</td>
                                            <td className="small text-muted">{order.forming_date ? new Date(order.forming_date).toLocaleString() : '-'}</td>
                                            <td>
                                                {order.status === 4 && !order.POF ? (
                                                    <div className="d-flex align-items-center text-warning">
                                                        <Spinner animation="border" size="sm" className="me-2" />
                                                        <span className="small fw-bold">Расчет...</span>
                                                    </div>
                                                ) : (
                                                    (order.POF || 0) > 0 ? (
                                                        <div className="d-flex flex-column lh-1">
                                                            <span className="fw-bold text-success small">POF: {order.POF?.toFixed(1)}%</span>
                                                            <span className="fw-bold text-success small">PHF: {order.PHF?.toFixed(1)}%</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted small">--</span>
                                                    )
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
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};