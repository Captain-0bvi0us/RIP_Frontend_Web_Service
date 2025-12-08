import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Spinner } from 'react-bootstrap';
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
import { Trash, CheckCircleFill, ExclamationCircle, Floppy, XCircleFill, CheckLg } from 'react-bootstrap-icons'; 
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
        if (currentOrder) {
            setFormData({
                age: currentOrder.age || 0,
                gender: currentOrder.gender || false,
                weight: currentOrder.weight || 0,
                height: currentOrder.height || 0
            });
            
            const descMap: {[key: number]: string} = {};
            currentOrder.factors?.forEach(f => {
                if(f.factor_id) descMap[f.factor_id] = f.description || '';
            });
            setDescriptions(descMap);
        }
    }, [currentOrder?.id, currentOrder?.age, currentOrder?.gender, currentOrder?.weight, currentOrder?.height, currentOrder?.factors]);

    if (operationSuccess) {
        return (
            <Container className="mt-5 pt-5 text-center">
                <Card className="p-5 shadow-sm border-0">
                    <h2 className="text-dark mb-3">Действие выполнено успешно!</h2>
                    <p className="text-muted">Статус заявки был обновлен.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/orders"><Button variant="danger">К списку заявок</Button></Link>
                    </div>
                </Card>
            </Container>
        );
    }

    if (loading || !currentOrder) return (
        <Container className="pt-5 mt-5 text-center">
            <Spinner animation="border" variant="danger" />
        </Container>
    );

    const isDraft = currentOrder.status === STATUS_DRAFT;
    const isFormed = currentOrder.status === STATUS_FORMED;
    const isCompleted = currentOrder.status === STATUS_COMPLETED;
    const isRejected = currentOrder.status === STATUS_REJECTED;

    const isModerator = user?.moderator;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.type === 'checkbox' || e.target.type === 'radio' 
            ? (e.target.id === 'gender-female') 
            : parseFloat(e.target.value);
            
        setFormData(prev => ({ ...prev, [e.target.name]: val }));
    };

    const handleSaveMain = () => {
        if(currentOrder.id) {
            dispatch(updateOrderFields({ 
                id: currentOrder.id, 
                data: { ...formData, gender: formData.gender } 
            }))
            .unwrap()
            .then(() => alert("Основные данные сохранены!"))
            .catch(() => alert("Ошибка при сохранении"));
        }
    };

    const handleSaveOneDescription = (factorId: number) => {
        if(currentOrder.id && descriptions[factorId] !== undefined) {
            dispatch(updateFactorDescription({
                orderId: currentOrder.id,
                factorId,
                desc: descriptions[factorId]
            }))
            .unwrap()
            .then(() => alert("Примечание сохранено"))
            .catch(() => alert("Ошибка сохранения примечания"));
        }
    };

    const handleApprove = () => {
        if (currentOrder.id && window.confirm("Принять заявку? Результаты будут сохранены.")) {
            dispatch(resolveOrder({ id: currentOrder.id, action: 'complete' }));
        }
    };

    const handleReject = () => {
        if (currentOrder.id && window.confirm("Отклонить заявку?")) {
            dispatch(resolveOrder({ id: currentOrder.id, action: 'reject' }));
        }
    };

    return (
        <Container className="pt-5 mt-5 pb-5">
            {/* Карточка заголовка */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="text-center py-2 d-flex justify-content-between align-items-center px-4">
                    <h4 className="fw-bold m-0">Заявка #{currentOrder.id}</h4>
                    <div>
                        {isDraft && <span className="badge bg-secondary">Черновик</span>}
                        {isFormed && <span className="badge bg-primary">В обработке</span>}
                        {isCompleted && <span className="badge bg-success">Завершена</span>}
                        {isRejected && <span className="badge bg-danger">Отклонена</span>}
                    </div>
                </Card.Body>
            </Card>

            <Row className="mb-4 g-4">
                {/* Левая колонка: Ввод данных */}
                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Body>
                            <h5 className="fw-bold mb-3">Анкета пациента</h5>
                            <Form>
                                <Form.Group as={Row} className="mb-2 align-items-center">
                                    <Form.Label column sm={4}>Возраст</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control 
                                            type="number" 
                                            name="age" 
                                            value={formData.age} 
                                            onChange={handleInputChange} 
                                            disabled={!isDraft} 
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2 align-items-center">
                                    <Form.Label column sm={4}>Пол</Form.Label>
                                    <Col sm={8}>
                                        <Form.Check 
                                            inline type="radio" label="Мужской" name="gender" id="gender-male" 
                                            checked={!formData.gender} 
                                            onChange={() => setFormData(p => ({...p, gender: false}))} 
                                            disabled={!isDraft} 
                                        />
                                        <Form.Check 
                                            inline type="radio" label="Женский" name="gender" id="gender-female" 
                                            checked={formData.gender} 
                                            onChange={() => setFormData(p => ({...p, gender: true}))} 
                                            disabled={!isDraft} 
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2 align-items-center">
                                    <Form.Label column sm={4}>Вес (кг)</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control 
                                            type="number" 
                                            name="weight" 
                                            value={formData.weight} 
                                            onChange={handleInputChange} 
                                            disabled={!isDraft} 
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2 align-items-center">
                                    <Form.Label column sm={4}>Рост (см)</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control 
                                            type="number" 
                                            name="height" 
                                            value={formData.height} 
                                            onChange={handleInputChange} 
                                            disabled={!isDraft} 
                                        />
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                 {/* Правая колонка: Результат */}
                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Body>
                            <h5 className="fw-bold mb-3">Результат расчета</h5>
                            
                            {/* Показываем результаты если заявка завершена ИЛИ если Модератор смотрит на сформированную */}
                            { (isCompleted || (isFormed && isModerator)) && (currentOrder.POF || 0) > 0 ? (
                                <div>
                                    <div className="mb-3">
                                        <strong>Остеопоротические переломы</strong>
                                        <div className="fs-4 text-success">{currentOrder.POF?.toFixed(1)}%</div>
                                    </div>
                                    <div>
                                        <strong>Перелом шейки бедра</strong>
                                        <div className="fs-4 text-success">{currentOrder.PHF?.toFixed(1)}%</div>
                                    </div>
                                    {isFormed && <div className="text-muted small mt-2 fst-italic">*Предварительный расчет асинхронного сервиса</div>}
                                </div>
                            ) : null }

                            {isRejected && (
                                <div className="text-center py-4">
                                    <ExclamationCircle size={48} className="text-danger mb-3" />
                                    <h5 className="text-danger fw-bold">Заявка отклонена</h5>
                                </div>
                            )}

                            {isFormed && !isModerator && (
                                <div className="text-center py-4 text-muted">
                                    <Spinner animation="border" size="sm" className="me-2"/>
                                    Ожидание проверки модератором...
                                </div>
                            )}

                            {isDraft && (
                                <div className="text-center py-4 text-muted">
                                    Заполните анкету и нажмите "Сформировать"
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Список факторов */}
            <div className="d-flex flex-column gap-3 mb-5">
                {currentOrder.factors?.map((f) => (
                    <Card key={f.factor_id} className="border-0 shadow-sm">
                        <Card.Body className="p-0">
                            <Row className="g-0">
                                <Col md={4} className="d-flex align-items-center p-3 border-end">
                                    <div className="me-3" style={{ width: 60 }}>
                                        <Image src={f.image || DefaultImage} fluid rounded />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-2">{f.title}</h6>
                                        <Link to={`/factors/${f.factor_id}`}>
                                            <Button size="sm" variant="danger">Подробнее</Button>
                                        </Link>
                                    </div>
                                    {isDraft && (
                                        <Button 
                                            variant="link" className="text-muted p-0 ms-2"
                                            onClick={() => dispatch(removeFactorFromOrder({ orderId: currentOrder.id!, factorId: f.factor_id! }))}
                                        >
                                            <Trash size={20} />
                                        </Button>
                                    )}
                                </Col>

                                <Col md={8} className="p-3 bg-light d-flex flex-column">
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={descriptions[f.factor_id!] || ''}
                                        onChange={(e) => setDescriptions(prev => ({ ...prev, [f.factor_id!]: e.target.value }))}
                                        disabled={!isDraft}
                                        className="border-0 bg-white mb-2"
                                        style={{ resize: 'none' }}
                                        placeholder="Дополнительная информация..."
                                    />
                                    {isDraft && (
                                         <div className="text-end">
                                            <Button size="sm" variant="outline-success" onClick={() => handleSaveOneDescription(f.factor_id!)}>
                                                <Floppy size={14}/> Сохранить
                                            </Button>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* --- КНОПКИ ДЕЙСТВИЙ --- */}
            
            {/* Для пользователя (Черновик) */}
            {isDraft && (
                <Row>
                    <Col className="d-flex gap-2">
                        <Button variant="outline-success" onClick={handleSaveMain}>
                            <Floppy className="me-2"/> Сохранить
                        </Button>
                        <Button variant="outline-danger" onClick={() => { if(window.confirm('Удалить?')) dispatch(deleteOrder(currentOrder.id!)); }}>
                            Удалить
                        </Button>
                    </Col>
                    <Col className="text-end">
                         <Button variant="success" size="lg" onClick={() => dispatch(submitOrder(currentOrder.id!))}>
                            Сформировать <CheckCircleFill className="ms-2"/>
                        </Button>
                    </Col>
                </Row>
            )}

            {/* Для Модератора (В работе) */}
            {isModerator && isFormed && (
                <Card className="mt-4 border-danger shadow">
                    <Card.Header className="bg-danger text-white fw-bold">Действия модератора</Card.Header>
                    <Card.Body className="d-flex justify-content-end gap-3">
                        <Button variant="outline-danger" size="lg" onClick={handleReject}>
                            <XCircleFill className="me-2" /> Отклонить
                        </Button>
                        <Button variant="success" size="lg" onClick={handleApprove}>
                            <CheckLg className="me-2" /> Принять (Подтвердить)
                        </Button>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};