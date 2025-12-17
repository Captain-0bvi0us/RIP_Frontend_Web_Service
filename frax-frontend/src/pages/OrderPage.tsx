import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Spinner, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchOrderById, 
    updateOrderFields, 
    updateFactorDescription, 
    removeFactorFromOrder,
    submitOrder,
    deleteOrder,
    resolveOrder, 
    resetOperationSuccess,
    clearCurrentOrder
} from '../store/slices/fraxSlice';
import { Trash, CheckCircleFill, Floppy, XCircleFill, HourglassSplit } from 'react-bootstrap-icons'; 
import type { AppDispatch, RootState } from '../store';



export const DefaultImage = '/mock_images/default.png';

const STATUS_DRAFT = 1;
const STATUS_FORMED = 3;
const STATUS_COMPLETED = 4;
const STATUS_REJECTED = 5;

export const OrderPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { currentOrder, loading, operationSuccess } = useSelector((state: RootState) => state.frax);
    const { user } = useSelector((state: RootState) => state.user);  
    const [formData, setFormData] = useState({ age: 0, gender: false, weight: 0, height: 0 });
    const [descriptions, setDescriptions] = useState<{[key: number]: string}>({});
    const isDraft = currentOrder?.status === STATUS_DRAFT;

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderById(id));
        }
        return () => {
            dispatch(clearCurrentOrder());
            dispatch(resetOperationSuccess());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (!id || isDraft) return
        console.log("Starting polling...");
        const intervalId = setInterval(() => {
            dispatch(fetchOrderById(id));
        }, 15000);
        return () => clearInterval(intervalId);
    }, [id, dispatch, isDraft]); 

    useEffect(() => {
        if (currentOrder) {
            setFormData(prev => ({
                age: currentOrder.age ?? prev.age,
                gender: currentOrder.gender ?? prev.gender,
                weight: currentOrder.weight ?? prev.weight,
                height: currentOrder.height ?? prev.height
            }));
            
            const descMap: {[key: number]: string} = {};
            currentOrder.factors?.forEach(f => {
                if(f.factor_id) descMap[f.factor_id] = f.description || '';
            });
            setDescriptions(descMap);
        }
    }, [currentOrder?.id, currentOrder?.factors]);

    if (operationSuccess) {
        return (
            <Container className="mt-5 pt-5 text-center">
                <Card className="p-5 shadow-sm border-0">
                    <h2 className="text-dark mb-3">Действие выполнено!</h2>
                    <p className="text-muted">Статус заявки обновлен.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/orders"><Button variant="danger">К списку</Button></Link>
                        <Button variant="outline-secondary" onClick={() => dispatch(resetOperationSuccess())}>
                            Остаться
                        </Button>
                    </div>
                </Card>
            </Container>
        );
    }

    if (loading && !currentOrder) {
        return (
            <Container className="pt-5 mt-5 text-center">
                <Spinner animation="border" variant="danger" />
            </Container>
        );
    }

    if (!currentOrder) return null;

    const isFormed = currentOrder.status === STATUS_FORMED;
    const isCompleted = currentOrder.status === STATUS_COMPLETED;
    const isRejected = currentOrder.status === STATUS_REJECTED;
    const isModerator = user?.moderator;
    const isWaitingForAsyncResult = isCompleted && (currentOrder.POF === 0 || currentOrder.POF === undefined);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.type === 'checkbox' || e.target.type === 'radio' 
            ? (e.target.id === 'gender-female') 
            : parseFloat(e.target.value) || 0;
        setFormData(prev => ({ ...prev, [e.target.name]: val }));
    };

    const handleSaveMain = () => {
        if(currentOrder.id) {
            dispatch(updateOrderFields({ 
                id: currentOrder.id, 
                data: { ...formData, gender: formData.gender } 
            }))
            .unwrap()
            .then(() => alert("Данные сохранены"))
            .catch(() => alert("Ошибка сохранения"));
        }
    };

    const handleSaveOneDescription = (factorId: number) => {
        if(currentOrder.id) {
            dispatch(updateFactorDescription({ 
                orderId: currentOrder.id, 
                factorId, 
                desc: descriptions[factorId] || '' 
            }))
            .unwrap()
            .then(() => alert("Примечание сохранено"))
            .catch(() => alert("Ошибка"));
        }
    };

    const handleApprove = () => {
        if (currentOrder.id && window.confirm("Принять заявку?")) dispatch(resolveOrder({ id: currentOrder.id, action: 'complete' }));
    };
    const handleReject = () => {
        if (currentOrder.id && window.confirm("Отклонить заявку?")) dispatch(resolveOrder({ id: currentOrder.id, action: 'reject' }));
    };

    return (
        <Container className="pt-5 mt-5 pb-5">
            {/* ШАПКА */}
            <Card className="border-0 shadow-sm mb-4 rounded-4 bg-white">
                <Card.Body className="py-3 px-4 d-flex justify-content-between align-items-center">
                    <h4 className="fw-bold m-0 text-secondary">Заявка <span className="text-dark">#{currentOrder.id}</span></h4>
                    <div className="d-flex align-items-center gap-2">
                        {isWaitingForAsyncResult && <Badge bg="warning" text="dark" className="px-3 py-2">Вычисление...</Badge>}
                        {!isWaitingForAsyncResult && isCompleted && <Badge bg="success" className="px-3 py-2">Завершена</Badge>}
                        {isFormed && <Badge bg="primary" className="px-3 py-2">В обработке</Badge>}
                        {isRejected && <Badge bg="danger" className="px-3 py-2">Отклонена</Badge>}
                        {isDraft && <Badge bg="secondary" className="px-3 py-2">Черновик</Badge>}
                    </div>
                </Card.Body>
            </Card>

            <Row className="mb-4 g-4">
                {/* ЛЕВАЯ КОЛОНКА: АНКЕТА */}
                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm rounded-4" style={{ backgroundColor: '#fff' }}>
                        <Card.Header className="bg-transparent border-0 pt-4 px-4 pb-0">
                            <h5 className="fw-bold m-0">Анкета пациента</h5>
                        </Card.Header>
                        <Card.Body className="px-4">
                            <Form>
                                <Form.Group as={Row} className="mb-3 align-items-center">
                                    <Form.Label column sm={4} className="text-muted fw-medium">Возраст</Form.Label>
                                    <Col sm={8}><Form.Control type="number" name="age" value={formData.age} onChange={handleInputChange} disabled={!isDraft} className="bg-light border-0" /></Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3 align-items-center">
                                    <Form.Label column sm={4} className="text-muted fw-medium">Пол</Form.Label>
                                    <Col sm={8}>
                                        <div className="d-flex gap-3">
                                            <Form.Check inline type="radio" label="Мужской" name="gender" id="gender-male" checked={!formData.gender} onChange={() => setFormData(p => ({...p, gender: false}))} disabled={!isDraft} />
                                            <Form.Check inline type="radio" label="Женский" name="gender" id="gender-female" checked={formData.gender} onChange={() => setFormData(p => ({...p, gender: true}))} disabled={!isDraft} />
                                        </div>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3 align-items-center">
                                    <Form.Label column sm={4} className="text-muted fw-medium">Вес (кг)</Form.Label>
                                    <Col sm={8}><Form.Control type="number" name="weight" value={formData.weight} onChange={handleInputChange} disabled={!isDraft} className="bg-light border-0" /></Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3 align-items-center">
                                    <Form.Label column sm={4} className="text-muted fw-medium">Рост (см)</Form.Label>
                                    <Col sm={8}><Form.Control type="number" name="height" value={formData.height} onChange={handleInputChange} disabled={!isDraft} className="bg-light border-0" /></Col>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* ПРАВАЯ КОЛОНКА: РЕЗУЛЬТАТЫ */}
                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative" style={{ backgroundColor: '#f8f9fa' }}>
                        
                        {isWaitingForAsyncResult && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white" style={{zIndex: 10}}>
                                <div className="spinner-grow text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}></div>
                                <h5 className="fw-bold text-primary animate-pulse">Анализ рисков...</h5>
                                <p className="text-muted small">Ожидание ответа от нейросети</p>
                            </div>
                        )}

                        <Card.Body className="d-flex flex-column justify-content-center p-4">
                            <h5 className="fw-bold mb-4">Результат расчета</h5>
                            
                            {/* Результаты */}
                            {!isWaitingForAsyncResult && isCompleted && (currentOrder.POF || 0) > 0 && (
                                <div className="text-center py-3">
                                    <div className="mb-4 p-3 bg-white rounded-3 shadow-sm border-start border-5 border-success">
                                        <div className="text-muted small text-uppercase mb-1">Остеопоротические переломы</div>
                                        <div className="display-4 fw-bold text-success">{currentOrder.POF?.toFixed(1)}%</div>
                                    </div>
                                    <div className="p-3 bg-white rounded-3 shadow-sm border-start border-5 border-success">
                                        <div className="text-muted small text-uppercase mb-1">Перелом шейки бедра</div>
                                        <div className="display-4 fw-bold text-success">{currentOrder.PHF?.toFixed(1)}%</div>
                                    </div>
                                </div>
                            )}

                            {isRejected && (
                                <div className="text-center text-danger py-4">
                                    <XCircleFill size={64} className="mb-3 op-50"/>
                                    <h4>Заявка отклонена</h4>
                                </div>
                            )}

                            {isFormed && !isModerator && (
                                <div className="text-center py-5 text-muted">
                                    <HourglassSplit size={48} className="mb-3"/>
                                    <h5>На проверке у модератора</h5>
                                </div>
                            )}

                            {isDraft && (
                                <div className="text-center py-5 text-muted">
                                    Заполните данные и отправьте заявку
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* СПИСОК ФАКТОРОВ */}
            <div className="d-flex flex-column gap-3 mb-5">
                {currentOrder.factors?.map((f) => (
                    <Card key={f.factor_id} className="border-0 shadow-sm rounded-3">
                        <Card.Body className="p-0">
                            <Row className="g-0">
                                <Col md={4} className="d-flex align-items-center p-3">
                                    <div className="me-3"><Image src={f.image || DefaultImage} fluid rounded style={{width: 60, height: 60, objectFit: 'cover'}} /></div>
                                    <div>
                                        <h6 className="fw-bold mb-1">{f.title}</h6>
                                        <Link to={`/factors/${f.factor_id}`} className="small text-danger text-decoration-none">Подробнее</Link>
                                    </div>
                                    {isDraft && <Button variant="link" className="text-muted ms-auto" onClick={() => dispatch(removeFactorFromOrder({ orderId: currentOrder.id!, factorId: f.factor_id! }))}><Trash/></Button>}
                                </Col>
                                <Col md={8} className="p-3 bg-light d-flex flex-column justify-content-center">
                                    {isDraft ? (
                                        <div className="d-flex gap-2">
                                            <Form.Control size="sm" value={descriptions[f.factor_id!] || ''} onChange={(e) => setDescriptions(prev => ({ ...prev, [f.factor_id!]: e.target.value }))} placeholder="Примечание..." className="border-0" />
                                            <Button size="sm" variant="light" onClick={() => handleSaveOneDescription(f.factor_id!)}><Floppy/></Button>
                                        </div>
                                    ) : (
                                        <p className="mb-0 small text-muted fst-italic">{f.description || "Нет примечаний"}</p>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* КНОПКИ ДЛЯ ЮЗЕРА */}
            {isDraft && (
                <div className="d-flex justify-content-between align-items-center bg-white p-4 rounded-4 shadow-sm sticky-bottom border-top">
                    <div>
                        <Button variant="outline-danger" className="me-2" onClick={() => { if(window.confirm('Удалить?')) dispatch(deleteOrder(currentOrder.id!)); }}>Удалить</Button>
                        <Button variant="outline-dark" onClick={handleSaveMain}>Сохранить черновик</Button>
                    </div>
                    <Button variant="success" size="lg" className="px-5 shadow" onClick={() => dispatch(submitOrder(currentOrder.id!))}>
                        Сформировать <CheckCircleFill className="ms-2"/>
                    </Button>
                </div>
            )}

            {/* КНОПКИ ДЛЯ МОДЕРАТОРА */}
            {isModerator && isFormed && (
                <div className="fixed-bottom p-4 bg-white border-top shadow-lg">
                    <Container className="d-flex justify-content-between align-items-center">
                        <h5 className="m-0 fw-bold text-dark">Панель модератора</h5>
                        <div className="d-flex gap-3">
                            <Button variant="outline-danger" size="lg" onClick={handleReject} className="px-4">Отклонить</Button>
                            <Button variant="success" size="lg" onClick={handleApprove} className="px-5">Принять и рассчитать</Button>
                        </div>
                    </Container>
                </div>
            )}
        </Container>
    );
};