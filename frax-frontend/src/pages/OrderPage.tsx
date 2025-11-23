import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchOrderById, 
    updateOrderFields, 
    updateFactorDescription, 
    removeFactorFromOrder,
    submitOrder,
    deleteOrder,
    resetOperationSuccess,
    clearCurrentOrder
} from '../store/slices/fraxSlice';
import { Trash, CheckCircleFill, ExclamationCircle } from 'react-bootstrap-icons';
import type { AppDispatch, RootState } from '../store';



export const DefaultImage = '/mock_images/default.png';

const STATUS_DRAFT = 1;
const STATUS_COMPLETED = 4;
const STATUS_REJECTED = 5;

export const OrderPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { currentOrder, loading, operationSuccess } = useSelector((state: RootState) => state.frax);
    const [formData, setFormData] = useState({ age: 0, gender: false, weight: 0, height: 0 });
    const [descriptions, setDescriptions] = useState<{[key: number]: string}>({});

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderById(id));
        }
        return () => { dispatch(clearCurrentOrder()); dispatch(resetOperationSuccess()); }
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
    }, [currentOrder]);

    if (operationSuccess) {
        return (
            <Container className="mt-5 pt-5 text-center">
                <Card className="p-5 shadow-sm border-0">
                    <h2 className="text-dark mb-3">Действие выполнено успешно!</h2>
                    <p className="text-muted">Заявка была сформирована/удалена.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/factors"><Button variant="outline-danger">К факторам</Button></Link>
                        <Link to="/orders"><Button variant="danger">К списку заявок</Button></Link>
                    </div>
                </Card>
            </Container>
        );
    }

    if (loading || !currentOrder) return <Container className="pt-5"><p>Загрузка...</p></Container>;

    const isDraft = currentOrder.status === STATUS_DRAFT;
    const isCompleted = currentOrder.status === STATUS_COMPLETED;
    const isRejected = currentOrder.status === STATUS_REJECTED;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.type === 'checkbox' || e.target.type === 'radio' 
            ? (e.target.id === 'gender-female') 
            : parseFloat(e.target.value);
            
        setFormData(prev => ({ ...prev, [e.target.name]: val }));
    };

    const handleSaveMain = () => {
        if(currentOrder.id) {
            console.log("Отправка данных:", formData);
            dispatch(updateOrderFields({ 
                id: currentOrder.id, 
                data: { ...formData, gender: formData.gender } 
            }))
            .unwrap()
            .then(() => alert("Данные успешно сохранены в БД!"))
            .catch(() => alert("Ошибка при сохранении"));
        }
    };

    const handleDescBlur = (factorId: number) => {
        if(currentOrder.id && descriptions[factorId] !== undefined) {
            dispatch(updateFactorDescription({
                orderId: currentOrder.id,
                factorId,
                desc: descriptions[factorId]
            }));
        }
    };

    return (
        <Container className="pt-5 mt-5 pb-5">
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="text-center py-2">
                    <h4 className="fw-bold m-0">Составление заявки</h4>
                </Card.Body>
            </Card>

            <Row className="mb-4 g-4">
                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Body>
                            <h5 className="fw-bold mb-3">Введите данные в анкету</h5>
                            <Form>
                                <Form.Group as={Row} className="mb-2 align-items-center">
                                    <Form.Label column sm={4}>Возраст</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control 
                                            type="number" name="age" 
                                            value={formData.age} onChange={handleInputChange} 
                                            disabled={!isDraft}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2 align-items-center">
                                    <Form.Label column sm={4}>Пол</Form.Label>
                                    <Col sm={8}>
                                        <Form.Check 
                                            inline type="radio" label="Мужской" 
                                            name="gender" id="gender-male"
                                            checked={!formData.gender} 
                                            onChange={() => setFormData(p => ({...p, gender: false}))}
                                            disabled={!isDraft}
                                        />
                                        <Form.Check 
                                            inline type="radio" label="Женский" 
                                            name="gender" id="gender-female"
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
                                            type="number" name="weight" 
                                            value={formData.weight} onChange={handleInputChange} 
                                            disabled={!isDraft}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2 align-items-center">
                                    <Form.Label column sm={4}>Рост (см)</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control 
                                            type="number" name="height" 
                                            value={formData.height} onChange={handleInputChange} 
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
                            <h5 className="fw-bold mb-3">Результат</h5>
                            
                            {/* Если ЗАВЕРШЕНА (4) */}
                            {isCompleted && (
                                <div>
                                    <div className="mb-3">
                                        <strong>Остеопоротические переломы</strong>
                                        <div className="fs-4 text-success">{currentOrder.POF?.toFixed(1)}%</div>
                                    </div>
                                    <div>
                                        <strong>Перелом шейки бедра</strong>
                                        <div className="fs-4 text-success">{currentOrder.PHF?.toFixed(1)}%</div>
                                    </div>
                                </div>
                            )}

                            {isRejected && (
                                <div className="text-center py-4">
                                    <ExclamationCircle size={48} className="text-danger mb-3" />
                                    <h5 className="text-danger fw-bold">Заявка отклонена</h5>
                                    <p className="text-muted">
                                        К сожалению, модератор отклонил вашу заявку. 
                                        <br />
                                        Возможно, данные были заполнены некорректно или нарушают правила сервиса.
                                        <br />
                                        Пожалуйста, создайте новую заявку или свяжитесь с поддержкой.
                                    </p>
                                </div>
                            )}

                            {!isCompleted && !isRejected && (
                                <div className="text-muted d-flex align-items-center h-75">
                                    <i>Результат будет доступен после обработки заявки модератором.</i>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

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

                                <Col md={8} className="p-3 bg-light">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Дополнительная информация..."
                                        value={descriptions[f.factor_id!] || ''}
                                        onChange={(e) => setDescriptions(prev => ({ ...prev, [f.factor_id!]: e.target.value }))}
                                        onBlur={() => handleDescBlur(f.factor_id!)}
                                        disabled={!isDraft}
                                        className="border-0 bg-white"
                                        style={{ resize: 'none' }}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {isDraft && (
                <Row>
                    <Col className="d-flex gap-2">
                        <Button variant="outline-success" onClick={handleSaveMain}>Сохранить изменения</Button>
                        <Button variant="outline-danger" onClick={() => {
                            if(window.confirm('Удалить заявку?')) dispatch(deleteOrder(currentOrder.id!));
                        }}>Удалить заявку</Button>
                    </Col>
                    <Col className="text-end">
                         <Button variant="outline-success" size="lg" onClick={() => dispatch(submitOrder(currentOrder.id!))}>
                            Сформировать <CheckCircleFill className="ms-2"/>
                        </Button>
                    </Col>
                </Row>
            )}
        </Container>
    );
};